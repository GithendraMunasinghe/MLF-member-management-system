interface Props {
  title: string;
  children: React.ReactNode;
}

export default function Section({ title, children }: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 mb-5">
      <h2 className="text-base font-semibold text-gray-700 mb-3">
        {title}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
        {children}
      </div>
    </div>
  );
}