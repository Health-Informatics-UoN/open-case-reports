import Image from "next/image";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer>
      <div className="bg-background py-6 border-t border-border">
        <div className="container mx-auto flex flex-col items-center gap-2">
          <Image
            src="/UoN-light.png"
            alt="Organisation Logo"
            width={150}
            height={70}
            priority
            className="block h-auto w-auto dark:hidden"
          />
          <Image
            src="/UoN-dark.png"
            alt="Organisation Logo"
            width={150}
            height={70}
            priority
            className="hidden h-auto w-auto dark:block"
          />
          <p className="text-center text-sm text-foreground">
            ©University of Nottingham {currentYear} | All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
