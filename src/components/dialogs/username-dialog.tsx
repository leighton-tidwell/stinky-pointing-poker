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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Dialog open={true} onOpenChange={setOpen}>
      <DialogContent className="border-primary/25">
        <DialogHeader>
          <DialogTitle className="text-primary">Identify yourself</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            We&apos;ll tag your pings with this moniker.
          </DialogDescription>
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
          className="mt-2 w-full"
          onClick={() => {
            if (username) {
              setOpen(false);
            }
          }}
        >
          Confirm Handle
        </Button>
      </DialogContent>
    </Dialog>
  );
};
