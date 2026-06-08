import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast } from "sonner";
import { FormField } from "@/components/ui/form-field";
import LoaderButton from "@/components/ui/loader-button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { signupSchema, type SignupFormValues } from "@/zod/auth";
import { signUp } from "@/helpers/auth-helpers";

export function SignUpForm() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      address: "",
      password: "",
    },
  });

  const onSubmit = async (values: SignupFormValues) => {
    setIsSubmitting(true);
    try {
      await signUp(values);
      toast.success("Account created successfully!");
      navigate({ to: "/signin" });
    } catch (error: any) {
      const message =
        error.response?.data?.message || "Failed to sign up. Please try again.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <CardContent className="space-y-4">
        <FormField
          label="Full Name"
          type="text"
          placeholder="John Doe"
          errorMessage={errors.name?.message}
          {...register("name")}
        />
        <FormField
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          errorMessage={errors.email?.message}
          {...register("email")}
        />
        <FormField
          label="Address"
          type="text"
          placeholder="123 Main St, Springfield"
          errorMessage={errors.address?.message}
          {...register("address")}
        />
        <FormField
          label="Password"
          type="password"
          placeholder="••••••••"
          errorMessage={errors.password?.message}
          {...register("password")}
        />
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <LoaderButton className="w-full" type="submit" isLoading={isSubmitting}>
          Sign up
        </LoaderButton>
        <div className="text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            to="/signin"
            className="font-semibold text-primary hover:underline"
          >
            Sign in
          </Link>
        </div>
      </CardFooter>
    </form>
  );
}

export default SignUpForm;
