"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type UsernameDialogProps = {
  username?: string;
  setOpen: (open: boolean) => void;
  setUsername: (username: string) => void;
};
export const UsernameDialog = ({
  username,
  setOpen,
  setUsername,
}: UsernameDialogProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const localStorageUsername = localStorage.getItem("username");
    if (localStorageUsername) {
      setUsername(localStorageUsername);
    }
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Who are you?</DialogTitle>
          <DialogDescription>Enter a name</DialogDescription>
        </DialogHeader>
        <Input
          placeholder="john doe"
          value={username}
          onChange={(event) => {
            setUsername(event.target.value);
            localStorage.setItem("username", event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && username) {
              setOpen(false);
            }
          }}
          required
        />
        <Button
          onClick={() => {
            if (username) {
              setOpen(false);
            }
          }}
        >
          Join Session
        </Button>
      </DialogContent>
    </Dialog>
  );
};
