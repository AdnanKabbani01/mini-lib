import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Define the form schema with Zod
const bookFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
  isbn: z.string().optional(),
  publisher: z.string().optional(),
  genre: z.string().optional(),
  description: z.string().optional(),
  coverImage: z.string().optional(),
  pageCount: z.coerce.number().positive().optional(),
  publicationYear: z.coerce.number().positive().optional(),
});

type BookFormValues = z.infer<typeof bookFormSchema>;

interface BookFormProps {
  defaultValues?: Partial<BookFormValues>;
  onSubmit: (data: BookFormValues) => void;
  isSubmitting?: boolean;
}

export function BookForm({
  defaultValues,
  onSubmit,
  isSubmitting = false,
}: BookFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      title: "",
      author: "",
      isbn: "",
      publisher: "",
      genre: "",
      description: "",
      coverImage: "",
      pageCount: undefined,
      publicationYear: undefined,
      ...defaultValues,
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="title" className="text-sm font-medium">
              Title <span className="text-red-500">*</span>
            </label>
            <Input id="title" {...register("title")} />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="author" className="text-sm font-medium">
              Author <span className="text-red-500">*</span>
            </label>
            <Input id="author" {...register("author")} />
            {errors.author && (
              <p className="text-sm text-red-500">{errors.author.message}</p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <label htmlFor="isbn" className="text-sm font-medium">
              ISBN
            </label>
            <Input id="isbn" {...register("isbn")} />
            {errors.isbn && (
              <p className="text-sm text-red-500">{errors.isbn.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="publisher" className="text-sm font-medium">
              Publisher
            </label>
            <Input id="publisher" {...register("publisher")} />
          </div>

          <div className="space-y-2">
            <label htmlFor="genre" className="text-sm font-medium">
              Genre
            </label>
            <Input id="genre" {...register("genre")} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="pageCount" className="text-sm font-medium">
              Page Count
            </label>
            <Input id="pageCount" type="number" {...register("pageCount")} />
          </div>

          <div className="space-y-2">
            <label htmlFor="publicationYear" className="text-sm font-medium">
              Publication Year
            </label>
            <Input
              id="publicationYear"
              type="number"
              {...register("publicationYear")}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="coverImage" className="text-sm font-medium">
            Cover Image URL
          </label>
          <Input id="coverImage" {...register("coverImage")} />
        </div>

        <div className="space-y-2">
          <label htmlFor="description" className="text-sm font-medium">
            Description
          </label>
          <textarea
            id="description"
            className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-800 dark:bg-slate-950 dark:ring-offset-slate-950 dark:placeholder:text-slate-400 dark:focus-visible:ring-blue-500"
            rows={4}
            {...register("description")}
          />
        </div>
      </div>

      <Button type="submit" disabled={isSubmitting}>
        {isSubmitting ? "Saving..." : "Save Book"}
      </Button>
    </form>
  );
}
