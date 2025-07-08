import { Search } from "lucide-react";

export default function ChatSearchForm() {
  return (
    <form>
      <label className="flex items-center border-none bg-sky-900 rounded-full my-4">
        <div className="pl-4">
          <Search />
        </div>
        <input
          type="text"
          placeholder="Search here..."
          className="px-3 py-3 leading-0 outline-none"
        />
      </label>
    </form>
  );
}
