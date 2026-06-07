import React, { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/contexts/auth-context";
import { FormField } from "@/components/ui/form-field";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { signinSchema } from "@/zod/auth";
import { signIn } from "@/helpers/auth-helpers";

type SigninFormValues = z.infer<typeof signinSchema>;

export function SignInForm() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SigninFormValues>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: SigninFormValues) => {
    setIsSubmitting(true);
    try {
      const user = await signIn(values);

      login(user);
      toast.success("Signed in successfully!");

      navigate({ to: "/" });
    } catch (error: any) {
      const message =
        error.response?.data?.message ||
        "Failed to sign in. Please check your credentials.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <CardContent className="space-y-4">
        <FormField
          label="Email Address"
          type="email"
          placeholder="john@example.com"
          errorMessage={errors.email?.message}
          {...register("email")}
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
        <Button className="w-full" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
        <div className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-primary hover:underline"
          >
            Sign up
          </Link>
        </div>
      </CardFooter>
    </form>
  );
}

export default SignInForm;
