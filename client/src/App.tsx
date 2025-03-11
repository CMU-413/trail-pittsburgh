import {
    BrowserRouter, Route, Routes 
} from 'react-router-dom';
import { HomePage } from './pages';

export function App() {
    return (
        <BrowserRouter>
            <div>
                <main>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}
