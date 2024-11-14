export interface ComponentType {
  id: string;
  type: 'button' | 'text' | 'image' | 'container' | 'form';
  props: {
    style: Record<string, string | number>;
    className?: string;
    children?: string;
    src?: string;
    alt?: string;
    [key: string]: any;
  };
  children?: ComponentType[];
}