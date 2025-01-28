"use client";

import React, { ReactNode } from 'react';
import {ThemeProvider} from "next-themes";

export default function RootProviders({children} : {children:ReactNode}) {
  return (
    <ThemeProvider 
    attribute="class"
    defaultTheme="dark"
    enableSystem
    disableTransitionOnChange
    >
        {children}
    </ThemeProvider>
  )
}
