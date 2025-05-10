'use client'

import { Suspense, useEffect, ReactNode } from "react"
import { AppShell, Overlay } from "@mantine/core"
import { useDisclosure, useMediaQuery } from "@mantine/hooks"
import { useStore } from "@/store/client/useStore"
import AppHeader from "@/components/dashboard/AppHeader"
import Navbar from "@/components/dashboard/Navbar"
import classes from "@/components/dashboard/styles/Dashboard.module.css"

export default function App({ children }: { children: ReactNode }) {
  const [opened, { toggle, close }] = useDisclosure()

  const { isNavbarCollapse } = useStore()

  const smallScreen = useMediaQuery("(max-width: 48em)")

  useEffect(() => {
    if (opened && smallScreen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "visible"
    }
  }, [opened, smallScreen])

  return (
    <AppShell
      padding="md"
      navbar={{
        width: isNavbarCollapse ? 298 : 81,
        breakpoint: "sm",
        collapsed: { mobile: !opened },
      }}
      classNames={{
        navbar: classes.navbar,
        header: classes.header,
        main: classes.main,
      }}
      header={{ height: 60 }}
    >
      <AppShell.Header>
        <AppHeader opened={opened} toggle={toggle} />
      </AppShell.Header>
      <AppShell.Navbar
        data-smallscreen={smallScreen}
        data-collapse={isNavbarCollapse}
      >
        <Navbar />
      </AppShell.Navbar>
      <AppShell.Main>
        {opened && smallScreen && (
          <Overlay
            onClick={close}
            zIndex={100}
            h="100vh"
            color="#000"
            backgroundOpacity={0.35}
            blur={15}
          />
        )}
        <Suspense fallback={<div>Loading</div>}>{children}</Suspense>
      </AppShell.Main>
    </AppShell>
  )
}
