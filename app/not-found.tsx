export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center">
      <h1 className="text-3xl font-bold">Página no encontrada</h1>
      <p className="text-gray-600 mt-4">
        La página que buscas no existe o fue movida.
      </p>
    </div>
  );
}
