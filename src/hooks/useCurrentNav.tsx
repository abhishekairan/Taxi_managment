import { useMemo } from "react"
import { usePathname } from "next/navigation"
import { sideLinks } from "@/components/dashboard/assets/navLinks"

export default function useCurrentNav() {
  const pathname = usePathname()

  const currentNav = useMemo(
    () =>
      sideLinks.find((link) => {
        return link.href.split("/").includes(pathname.split("/")[1])
      }),
    [pathname]
  )

  return currentNav
}
