import { Form } from "react-router";
type ParamsButtonFormProps = {
  name: string;
  value: string;
  children: React.ReactNode;
};

export default function ParamsButtonForm({
  name,
  value,
  children,
}: ParamsButtonFormProps) {
  return (
    <Form>
      <button name={name} value={value} className="flex items-center gap-3">
        {children}
      </button>
    </Form>
  );
}
