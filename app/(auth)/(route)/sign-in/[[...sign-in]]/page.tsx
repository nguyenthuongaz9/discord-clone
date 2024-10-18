import { SignIn } from "@clerk/nextjs";


export default function Page() {
  return <SignIn

    appearance={{
      elements: {
        footerActionText: {
          display: 'none',
        },
        footerActionLink: {
          display: 'none',
        },
      },
    }}
  />;
}