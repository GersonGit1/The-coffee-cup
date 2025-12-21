"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useBusiness } from "@/src/context/BusinessContextType";
import { toast } from "react-toastify";
import Spinner from "@/components/ui/Spinner";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/16/solid";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  let isLoading = false;
  const business = useBusiness();
  const [form, setForm] = useState({
    email: "",
    password: "",
    BusinessId: business.id,
  });

  const mutation = useMutation({
    mutationFn: async () => {
      isLoading = true;
      const res = await fetch(`/${business.slug}/login/api`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      console.log('res', res);
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al iniciar sesión");
      }
      isLoading = false;
      return;
    },
    onSuccess: () => {
      isLoading = false;
      window.location.href = `/${business.slug}/admin/products`;
    },
    onError: (error) => {
      isLoading = false;
      console.log('error', error);
      toast.error(error.message);
    }
  });

  return (
    <div className="max-w-md mx-auto mt-16">
      <h1 className="text-2xl font-semibold mb-6">
        Iniciar sesión
      </h1>

      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          mutation.mutate();
        }}
      >
        <input
          type="email"
          placeholder="correo@ejemplo.com"
          className="w-full border rounded px-3 py-2"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />
      
      <div className="flex flex-col gap-5 relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="password"
          className="w-full border rounded px-3 py-2"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />
        <span
              className=" absolute top-2.5 right-3 transform cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeIcon height={20} width={20} aria-hidden="true"/> :
             <EyeSlashIcon height={20} width={20} aria-hidden="true"/>}
          </span>
      </div>

        <button
          type="submit"
          disabled={mutation.isPending}
          className="w-full bg-black text-white py-2 rounded disabled:opacity-50 cursor-pointer"
        >
          Iniciar
          {
            mutation.isPending || isLoading ? (<span className="ml-2"><Spinner/></span>) : null
          }
        </button>
      </form>
    </div>
  );
}
