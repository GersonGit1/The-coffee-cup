"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useBusiness } from "@/src/context/BusinessContextType";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";

export default function ChangePasswordPage() {
  const business = useBusiness();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const mutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(`/${business.slug}/admin/account/api`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Error");
      return res.json();
    },
  });

  return (
    <div className="max-w-md mx-auto mt-16">
      <h1 className="text-2xl font-semibold mb-6">
        Cambiar contraseña
      </h1>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
        <div className="flex flex-col gap-5 relative">
          <input
            type={showCurrentPassword ? "text" : "password"}
            placeholder="Password actual"
            className="w-full border rounded px-3 py-2"
            value={form.currentPassword}
            onChange={(e) =>
              setForm({ ...form, currentPassword: e.target.value })
            }
          />
          <span
              className=" absolute top-2.5 right-3 transform cursor-pointer"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            {showCurrentPassword ? <EyeIcon height={20} width={20} aria-hidden="true"/> :
             <EyeSlashIcon height={20} width={20} aria-hidden="true"/>}
          </span>
        </div>

        <div className="flex flex-col gap-5 relative">
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="Nueva password"
            className="w-full border rounded px-3 py-2"
            value={form.newPassword}
            onChange={(e) =>
              setForm({ ...form, newPassword: e.target.value })
            }
          />
          <span
              className=" absolute top-2.5 right-3 transform cursor-pointer"
              onClick={() => setShowNewPassword(!showNewPassword)}
          >
            {showNewPassword ? <EyeIcon height={20} width={20} aria-hidden="true"/> :
             <EyeSlashIcon height={20} width={20} aria-hidden="true"/>}
          </span>
        </div>

        <div className="flex flex-col gap-5 relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirmar nueva password"
            className="w-full border rounded px-3 py-2"
            value={form.confirmPassword}
            onChange={(e) =>
              setForm({ ...form, confirmPassword: e.target.value })
            }
          />
          <span
              className=" absolute top-2.5 right-3 transform cursor-pointer"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <EyeIcon height={20} width={20} aria-hidden="true"/> :
             <EyeSlashIcon height={20} width={20} aria-hidden="true"/>}
          </span>
        </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50"
        >
          Guardar cambios
        </button>

        {mutation.isSuccess && (
          <p className="text-green-600 text-sm">
            Contraseña actualizada
          </p>
        )}

        {mutation.isError && (
          <p className="text-red-600 text-sm">
            Error al cambiar la contraseña
          </p>
        )}
      </form>
    </div>
  );
}
