import ConnectSearch from "@/features/users/components/connectBox/search";

export default function Connect() {
  return (
    <div>
      <div className="flex flex-col px-4 pb-4 bg-white">
        <h1 className="text-xl font-semibold py-2">Find Connects</h1>
        <ConnectSearch />
      </div>
    </div>
  );
}
