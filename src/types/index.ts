export interface ComponentType {
  id: string;
  type: string;
  props: {
    style: Record<string, string | number>;
    className?: string;
    children?: string;
    src?: string;
    alt?: string;
    href?: string;
    placeholder?: string;
    value?: string;
    checked?: boolean;
    min?: number;
    max?: number;
    step?: number;
    options?: { label: string; value: string }[];
    [key: string]: any;
  };
  children?: ComponentType[];
}