import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const checkoutFormSchema = z.object({
  borrowerName: z.string().min(1, "Borrower name is required"),
  dueDate: z.string().min(1, "Due date is required"),
});

type CheckoutFormValues = z.infer<typeof checkoutFormSchema>;

interface CheckoutFormProps {
  onSubmit: (data: CheckoutFormValues) => void;
  isSubmitting?: boolean;
}

export function CheckoutForm({ onSubmit, isSubmitting = false }: CheckoutFormProps) {
  const today = new Date();
  const twoWeeksFromToday = new Date(today);
  twoWeeksFromToday.setDate(today.getDate() + 14);
  const defaultDueDate = twoWeeksFromToday.toISOString().split("T")[0];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      borrowerName: "",
      dueDate: defaultDueDate,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="borrowerName" className="text-sm font-medium">
            Borrower Name <span className="text-red-500">*</span>
          </label>
          <Input id="borrowerName" {...register("borrowerName")} />
          {errors.borrowerName && (
            <p className="text-sm text-red-500">{errors.borrowerName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="dueDate" className="text-sm font-medium">
            Due Date <span className="text-red-500">*</span>
          </label>
          <Input id="dueDate" type="date" {...register("dueDate")} />
          {errors.dueDate && (
            <p className="text-sm text-red-500">{errors.dueDate.message}</p>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Processing..." : "Checkout Book"}
      </Button>
    </form>
  );
} 