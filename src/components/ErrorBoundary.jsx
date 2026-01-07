import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-lg w-full">
            <div className="text-center">
              <div className="text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Oops! Something went wrong</h1>
              <p className="text-gray-600 mb-6">
                The weather app encountered an unexpected error. Please try refreshing the page.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
              >
                Refresh Page
              </button>
              {this.state.error && (
                <details className="mt-6 text-left">
                  <summary className="cursor-pointer text-gray-700 font-semibold hover:text-gray-900">
                    Technical Details
                  </summary>
                  <div className="mt-4 p-4 bg-red-50 rounded border border-red-200">
                    <p className="text-red-800 font-mono text-sm whitespace-pre-wrap">
                      {this.state.error.toString()}
                    </p>
                    {this.state.errorInfo && (
                      <pre className="mt-2 text-xs text-red-700 overflow-auto max-h-40">
                        {this.state.errorInfo.componentStack}
                      </pre>
                    )}
                  </div>
                </details>
              )}
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
