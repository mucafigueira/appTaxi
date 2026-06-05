export default function DriverCard({ title, value }) {
    return (
        <div className="rounded-xl border  border-base-200 bg-base-100 p-4 shadow-sm">
            <p className="text-sm text-gray-500">{title}</p>
            <p className="mt-2 text-xl font-semibold">{value}</p>
        </div>
    );
}
