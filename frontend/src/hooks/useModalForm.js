import { useState } from "react";

export function useMoldalForm() {
  const [statusAlert, setStatusAlert]= useState(false);


  return {
    statusAlert,
    setStatusAlert
  };
}
