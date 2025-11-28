import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import * as React from "react";
import { useEffect } from "react";
import {
  useForm,
  UseFormReturn,
  SubmitHandler,
  UseFormProps,
  FieldValues,
} from "react-hook-form";
import { ZodType, ZodTypeDef } from "zod";

type FormProps<TFormValues extends FieldValues, Schema> = {
  className?: string;
  onSubmit: SubmitHandler<TFormValues>;
  children: (form: UseFormReturn<TFormValues>) => React.ReactNode;
  options?: UseFormProps<TFormValues>;
  id?: string;
  schema?: Schema;
};

export function Form<
  TFormValues extends Record<string, unknown> = Record<string, unknown>,
  Schema extends ZodType<unknown, ZodTypeDef, unknown> = ZodType<
    unknown,
    ZodTypeDef,
    unknown
  >,
>({
  onSubmit,
  children,
  className,
  options,
  id,
  schema,
}: FormProps<TFormValues, Schema>) {
  const form = useForm<TFormValues>({
    mode: "onChange",
    ...options,
    resolver: schema && zodResolver(schema),
  });

  const { formState, reset } = form;

  useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset(undefined, options?.resetOptions);
    }
  }, [formState, reset]);

  return (
    <form
      className={clsx("space-y-4", className)}
      onSubmit={form.handleSubmit(onSubmit)}
      id={id}
    >
      {children(form)}
    </form>
  );
}
