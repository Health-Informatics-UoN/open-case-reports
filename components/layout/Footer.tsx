import Link from "next/link";
import Image from "next/image";
// Footer navigation links

const FOOTER_LINKS = [
  {
    href: "https://docs.federated-analytics.ac.uk/five_safes_tes",
    label: "About Five Safes TES",
  },
  { href: "https://dareuk.org.uk/", label: "About DARE UK" },
  { href: "https://dareuk.org.uk/get-in-touch/", label: "Contact Us" },
] as const;

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
            className="block dark:hidden"
          />
          <Image
            src="/UoN-dark.png"
            alt="Organisation Logo"
            width={150}
            height={70}
            className="hidden dark:block"
          />
          <p className="text-center text-sm text-foreground">
            ©University of Nottingham {currentYear} | All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
