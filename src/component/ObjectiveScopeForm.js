// ObjectiveScopeForm.js
import React from 'react';

const ObjectiveScopeForm = ({ formData, handleInputChange }) => {
    return (
        <div>
            <div>
                <label>
                    Objetivo:
                    <textarea
                        name="objective"
                        value={formData.objective || ""} // Garantir que o valor seja controlado
                        onChange={handleInputChange} // Passa a função de atualização
                        rows="10"
                        style={{ width: "100%" }}
                    />
                </label>
            </div>

            <div>
                <label>
                    Escopo:
                    <textarea
                        name="scope"
                        value={formData.scope || ""} // Garantir que o valor seja controlado
                        onChange={handleInputChange} // Passa a função de atualização
                        rows="10"
                        style={{ width: "100%" }}
                    />
                </label>
            </div>
        </div>
    );
};

export default ObjectiveScopeForm;
