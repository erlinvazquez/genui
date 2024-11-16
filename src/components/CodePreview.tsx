import React from 'react';
import Editor from '@monaco-editor/react';
import type { ComponentType } from '../types';

interface CodePreviewProps {
  components: ComponentType[];
}

export const CodePreview: React.FC<CodePreviewProps> = ({ components }) => {
  const generateCode = () => {
    const generateComponentCode = (component: ComponentType): string => {
      const styleString = Object.entries(component.props.style)
        .map(([key, value]) => `${key}: "${value}"`)
        .join(', ');

      switch (component.type) {
        case 'heading':
          return `<h1 style={{ ${styleString} }}>${component.props.children || ''}</h1>`;
        case 'text':
          return `<p style={{ ${styleString} }}>${component.props.children || ''}</p>`;
        case 'button':
          return `<button style={{ ${styleString} }}>${component.props.children || 'Button'}</button>`;
        case 'link':
          return `<a href="${component.props.href || '#'}" style={{ ${styleString} }}>${component.props.children || 'Link'}</a>`;
        case 'image':
          return `<img src="${component.props.src || ''}" alt="${component.props.alt || ''}" style={{ ${styleString} }} />`;
        case 'video':
          return `<video src="${component.props.src || ''}" controls style={{ ${styleString} }} />`;
        case 'container':
          return `<div style={{ ${styleString} }}>${
            component.children?.map(child => generateComponentCode(child)).join('\n') || ''
          }</div>`;
        default:
          return `<div style={{ ${styleString} }}>Component: ${component.type}</div>`;
      }
    };

    const componentCode = components.map(generateComponentCode).join('\n  ');
    
    return `import React from 'react';

export const GeneratedComponent = () => {
  return (
    <div className="generated-component">
      ${componentCode}
    </div>
  );
};`;
  };

  return (
    <div className="h-full">
      <Editor
        height="100%"
        defaultLanguage="typescript"
        defaultValue={generateCode()}
        value={generateCode()}
        options={{
          readOnly: true,
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
        }}
        theme="vs-dark"
      />
    </div>
  );
};