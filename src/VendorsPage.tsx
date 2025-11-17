import React, { useEffect } from "react";
import { VendorsApi } from "@scriptrunnerhq/vendors-api";

export default function VendorsPage() {
  useEffect(() => {
    VendorsApi.init();
  }, []);

  return (
    <div
      data-scriptrunner-vendors-api-client-id="YOUR_CLIENT_ID"
      data-scriptrunner-vendors-api-client-secret="YOUR_CLIENT_SECRET"
    >
      <h2>Vendors API Initialized</h2>
    </div>
  );
}