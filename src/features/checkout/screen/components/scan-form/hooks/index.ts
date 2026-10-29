import { ProductNotFoundError, useProductLookup, type Product } from '@features/catalog';
import { zodResolver } from '@hookform/resolvers/zod';
import useAnnouncer from '@shared/hooks/use-announcer';
import { useEffect, useRef, type FormEvent } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { CHECKOUT_MESSAGES, CHECKOUT_TEXT } from '../../../../constants/messages';
import useSaleMutations from '../../../../hooks/use-sale-mutations';
import { addProductToSale, MaxQuantityExceededError } from '../../../../models/sale';
import { parseScanInput } from '../../../../models/scan-input';
import useSaleStore from '../../../../store';
import ScanSchema, { type ScanFormValues } from '../schema';

const lookupErrorMessage = (error: unknown, code: string): string =>
  error instanceof ProductNotFoundError
    ? CHECKOUT_MESSAGES.unknownCode(code)
    : CHECKOUT_MESSAGES.lookupFailed;

/**
 * Scan form logic (CU-01): validates the field, looks the product up and adds it to the sale.
 *
 * @remarks
 * - The field is emptied as soon as a code is sent, so the scanner can type the next one.
 * - Scans are processed **in order** through a promise queue (CU-01 A7): a slow lookup never
 *   lets a later scan overtake it.
 * - A failing scan puts its text back, selected, with the error (A2, A3, A4, A6).
 *
 * @param disabled - The field is disabled while the sale loads; it takes the focus when enabled
 *   (`autoFocus` does nothing on a disabled field).
 * @returns Field registration, its error and the submit handler.
 */
const useScanForm = (disabled: boolean) => {
  const lookup = useProductLookup();
  const { addProduct } = useSaleMutations();
  const announce = useAnnouncer();
  const queue = useRef<Promise<void>>(Promise.resolve());

  const {
    register,
    handleSubmit,
    setValue,
    clearErrors,
    setError,
    setFocus,
    formState: { errors },
  } = useForm<ScanFormValues>({
    resolver: zodResolver(ScanSchema),
    defaultValues: { code: '' },
  });

  useEffect(() => {
    if (!disabled) setFocus('code');
  }, [disabled, setFocus]);

  const showError = (raw: string, message: string) => {
    setValue('code', raw);
    setError('code', { message });
    setFocus('code', { shouldSelect: true });
  };

  const add = (product: Product, quantity: number) => {
    addProduct.mutate(
      { product, quantity },
      { onError: () => toast.error(CHECKOUT_MESSAGES.addFailed(product.name)) },
    );
    const line = useSaleStore
      .getState()
      .sale?.lines.find(({ productId }) => productId === product.id);
    announce(CHECKOUT_TEXT.added(product.name, line?.quantity ?? quantity));
  };

  const process = async (raw: string, code: string, quantity: number): Promise<void> => {
    let product: Product;
    try {
      product = await lookup(code);
    } catch (error) {
      showError(raw, lookupErrorMessage(error, code));
      return;
    }

    const sale = useSaleStore.getState().sale;
    if (!sale) return;
    try {
      // Same rule as the mutation, checked first so the field can show it (CU-01 A6).
      addProductToSale(sale, product, quantity);
    } catch (error) {
      if (error instanceof MaxQuantityExceededError) showError(raw, CHECKOUT_MESSAGES.maxQuantity);
      return;
    }
    add(product, quantity);
  };

  const enqueue = ({ code: raw }: ScanFormValues) => {
    const input = parseScanInput(raw);
    if (input.kind !== 'scan') return;
    // Not reset(): it unregisters the field and relies on register() returning a new ref on the
    // next render, which the React Compiler memoizes away (the field would stop updating).
    setValue('code', '');
    clearErrors('code');
    useSaleStore.getState().selectLine(null);
    queue.current = queue.current.then(() => process(raw, input.code, input.quantity));
  };

  // handleSubmit is built inside the event, not during render: the queue ref is only touched
  // when the cashier submits (React Compiler `refs` rule).
  const submit = (event: FormEvent<HTMLFormElement>) =>
    handleSubmit(enqueue, () => setFocus('code', { shouldSelect: true }))(event);

  return { register, error: errors.code?.message, submit };
};

export default useScanForm;
