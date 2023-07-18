# ClientOnly.tsx

This file contains the `ClientOnly` component.

## Component Description

The `ClientOnly` component is responsible for rendering its children only on the client-side. It ensures that the children are not rendered on the server-side during server-side rendering (SSR).

## Usage

```tsx
import React from 'react';

const ClientOnly: React.FC = ({ children }) => {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ? <>{children}</> : null;
};

export default ClientOnly;
```

## Props

The `ClientOnly` component does not accept any props.

## Example

```tsx
import React from 'react';
import ClientOnly from './ClientOnly';

const App: React.FC = () => {
  return (
    <div>
      <h1>Client-Only Component Example</h1>
      <ClientOnly>
        <p>This content will only be rendered on the client-side.</p>
      </ClientOnly>
    </div>
  );
};

export default App;
```

In the above example, the `ClientOnly` component wraps the `<p>` element, ensuring that it is only rendered on the client-side.
