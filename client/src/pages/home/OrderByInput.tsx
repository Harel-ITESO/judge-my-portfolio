interface Props {
  orderChangeHandler: (orderType: string) => void;
}

export default function OrderByInput({ orderChangeHandler }: Props) {
  return (
    <div className="flex items-center gap-4 justify-end">
      <label htmlFor="order-by-select">Sort by:</label>
      <select
        name="order-by-select"
        className="px-4 py-2 rounded"
        onChange={(e) => orderChangeHandler(e.target.value)}
      >
        <option value="1">Most Viewed</option>
        <option value="2">Best Rated</option>
        <option value="3">Recent</option>
      </select>
    </div>
  );
}
