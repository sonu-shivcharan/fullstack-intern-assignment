import { createFileRoute } from "@tanstack/react-router";
import SignInForm from "@/components/auth/SignInForm";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

export const Route = createFileRoute("/(auth)/signin")({
  component: SigninPage,
});

function SigninPage() {
  return (
    <div className="flex min-h-screen w-full items-center justify-center p-6 bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Welcome back</CardTitle>
          <CardDescription>
            Enter your credentials below to sign in
          </CardDescription>
        </CardHeader>
        <SignInForm />
      </Card>
    </div>
  );
}

export default SigninPage;
