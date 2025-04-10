import { useState } from 'react';
import supabase from '../../supabaseclient';

function CadastroDep() {
    const [nome, setNome] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { data, error } = await supabase
            .from('departamento')
            .insert([{ nome }]);
        
        if (error) {
            console.error('Erro ao cadastrar departamento:', error.message);
        } else {
            console.log('Departamento cadastrado com sucesso:', data);
            setNome('');
          
        }
    };
    
    return (
        <>
        <br />
        <a id='voltar' href="/">Voltar</a>
        <br/>
        <div id="form-container">
            <h2>Cadastro de Departamento</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-group">
                    <label htmlFor="nome" className="text-sm font-medium">Nome do Departamento</label>
                    <input 
                        type="text" 
                        id="nome" 
                        value={nome} 
                        onChange={(e) => setNome(e.target.value)} 
                        className="w-full p-2 border rounded-md"
                        required
                    />
                </div>
             
                <button id="submit-button" type="submit">
                    Cadastrar
                </button>
            </form>
            <div id="message"></div>
        </div></>
    );
}

export default CadastroDep;
