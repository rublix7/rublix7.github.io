import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Simple Error Boundary to catch "White Screen" errors
class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen bg-red-50 text-red-900 p-8 flex-col text-center">
          <h1 className="text-2xl font-bold mb-4">Что-то пошло не так</h1>
          <p className="mb-4">Произошла ошибка при загрузке приложения.</p>
          <pre className="bg-white p-4 rounded shadow text-left overflow-auto max-w-2xl text-sm font-mono border border-red-200">
            {this.state.error?.toString()}
          </pre>
          <p className="mt-4 text-sm text-gray-600">
             Проверьте консоль браузера (F12) для деталей. Убедитесь, что файл .env создан.
          </p>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);