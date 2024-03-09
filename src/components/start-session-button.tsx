"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createSession } from "@/actions/session";
import { Spinner } from "@/components/spinner";
import { useRouter } from "next/navigation";
import { PlusCircle } from "lucide-react";

export const StartSessionButton = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const startSession = async () => {
    setLoading(true);
    try {
      const session = await createSession();
      router.push(`/session/${session.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      onClick={startSession}
      disabled={loading}
      className="m-auto gap-2"
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          Start New Session
          <PlusCircle />
        </>
      )}
    </Button>
  );
};
