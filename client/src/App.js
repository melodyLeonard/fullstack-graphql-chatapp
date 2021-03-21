import "./App.scss";
import { Container } from "react-bootstrap";
import ApolloProvider from "./Apollo/ApolloProvider";
import Router from "./router";
import { AuthProvider } from "./context/authentication/authState";
import { MessageProvider } from "./context/message/messageState";
function App() {
  return (
    <ApolloProvider>
      <AuthProvider>
        <MessageProvider>
          <div className="app-container">
            <Router />
          </div>
        </MessageProvider>
      </AuthProvider>
    </ApolloProvider>
  );
}

export default App;
