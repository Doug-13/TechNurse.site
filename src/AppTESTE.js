import React, { useState } from "react";
import { Menu, MenuItem, IconButton, Tabs, Tab, Box } from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import WordDocument from "./component/WordDocument";
import GeneratePdf from "./component/GeneratePdf";
import { generateJsonPayload } from './component/generateJson';
import ObjectiveScopeForm from './component/ObjectiveScopeForm';  // Importe o novo componente
import NotificationComponent from './component/Notification'; // Componente de notificações
import FormComponent from "./component/FormComponent"
import DynamicTable from "./component/DynamicTable";
import DeleteIcon from '@mui/icons-material/Delete';

import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    // description: "",
    // image: null,
    analist: "",
    job: "",
    sales: "",
    lowCoder: "",
    // preview: "",
    // creation: "",
    // processName: "",
    // notification: "",
    // objective: "",
    // scope: "",
  });

  const [processes, setProcesses] = useState([
    {
      processName: "Objetivo e Escopo",
      codingRulesTable: [["", ""]],
      detailsTable: [["", "", "", "", ""]],
      listTable: [["", ""]],
      actionsTable: [["", "", "", "", ""]],
      preview: formData.preview || "",
      creation: formData.creation || "",
      notification: formData.notification || "",
      image: formData.image || null,
      imagePreview: formData.image ? URL.createObjectURL(formData.image) : null,
    },
    {
      processName: "Notificações, Views e Relatórios",
      codingRulesTable: [["", ""]],
      detailsTable: [["", "", "", "", ""]],
      listTable: [["", ""]],
      actionsTable: [["", "", "", "", ""]],
      preview: formData.preview || "",
      creation: formData.creation || "",
      notification: formData.notification || "",
      image: formData.image || null,
      imagePreview: formData.image ? URL.createObjectURL(formData.image) : null,
    }
  ]);

  const [notifications, setNotifications] = useState([]); // Adicionar estado para notificações
  const [newNotification, setNewNotification] = useState({
    nameNotification: '',
    recipient: '',
    subject: '',
    title: '',
    body: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [listName, setListName] = useState("");
  const [codingRulesTable, setCodingRulesTable] = useState([["", ""]]); // Tabela de regras de codificação
  const [detailsTable, setDetailsTable] = useState([["", "", "", "", ""]]); // Tabela de metadados
  const [listTable, setListTable] = useState([["", ""]]); // Tabela de listas
  const [actionsTable, setActionsTable] = useState([["", "", "", "", ""]]); // Tabela de ações
  // const [processes, setProcesses] = useState([]); // Para armazenar processos dinâmicos
  const [activeTab, setActiveTab] = useState(0);
  const [anchorEl, setAnchorEl] = useState(null);
  const isMenuOpen = Boolean(anchorEl);

  const [lists, setLists] = useState([]); // Para armazenar as listas criadas

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProcesses((prevProcesses) => {
        const updatedProcesses = [...prevProcesses];
        updatedProcesses[activeTab] = {
          ...updatedProcesses[activeTab],
          image: file,
          imagePreview: URL.createObjectURL(file),
        };

        return updatedProcesses;
      });
    }
  };
// ##############################################################

  const convertImageToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve(reader.result); // Retorna o Base64 da imagem
    };
    reader.onerror = () => {
      reject("Erro ao converter imagem para Base64.");
    };
    reader.readAsDataURL(file); // Converte a imagem para Base64
  });
};

// ##############################################################

  // Manipulador de alteração de campos de entrada
  const handleInputChange = (e, processIndex) => {
    const { name, value } = e.target;
    setProcesses((prevProcesses) => {
      const updatedProcesses = [...prevProcesses];
      updatedProcesses[processIndex] = {
        ...updatedProcesses[processIndex],
        [name]: value, // Atualiza o campo específico do processo
      };
      return updatedProcesses;
    });
  };

  const handleDeleteProcess = (index) => {
    const confirmDelete = window.confirm("Você tem certeza que deseja excluir este processo?");
    if (confirmDelete) {
      const updatedProcesses = processes.filter((_, i) => i !== index);
      setProcesses(updatedProcesses);

      // Limpar os campos relacionados ao processo excluído
      if (index === activeTab) {
        setCodingRulesTable([["", ""]]);
        setDetailsTable([["", "", "", "", ""]]);
        setListTable([["", ""]]);
        setActionsTable([["", "", "", "", ""]]);
        setImagePreview(null);
        setFormData({
          ...formData,
          preview: "",
          creation: "",
          notification: "",
        });
      }

      // Ajustar aba ativa
      setActiveTab((prev) => (prev > 0 ? prev - 1 : 0));
    }
  };

  // const handleSave = () => {
  //   try {
  //     console.log("FormData:", formData);
  //     console.log("Processes:", processes); // Certifique-se de que processes está definido

  //     if (!processes || processes.length === 0) {
  //       throw new Error("Nenhum processo disponível para salvar.");
  //     }

  //     const dataToSave = {
  //       formData,
  //       processes,
  //     };

  //     const jsonOutput = generateJsonPayload(dataToSave);
  //     console.log("JSON gerado:", JSON.stringify(jsonOutput, null, 2));

  //     localStorage.setItem("processData", JSON.stringify(dataToSave));
  //     alert("Processos salvos com sucesso!");
  //   } catch (error) {
  //     console.error("Erro ao salvar os processos:", error);
  //     alert("Erro ao salvar os processos.");
  //   }
  // };

  const handleSave = async () => {
    try {
      console.log("FormData:", formData);
      console.log("Processes:", processes); // Certifique-se de que processes está definido
  
      if (!processes || processes.length === 0) {
        throw new Error("Nenhum processo disponível para salvar.");
      }
  
      // Converter as imagens para Base64
      const updatedProcesses = await Promise.all(
        processes.map(async (process) => {
          if (process.image) {
            const base64Image = await convertImageToBase64(process.image);
            return {
              ...process,
              imagePreview: base64Image, // Substitui a URL pela imagem em Base64
            };
          }
          return process;
        })
      );
  
      const dataToSave = {
        formData,
        processes: updatedProcesses, // Usa os processos com imagem em Base64
      };
  
      const jsonOutput = generateJsonPayload(dataToSave);
      console.log("JSON gerado:", JSON.stringify(jsonOutput, null, 2));
  
      localStorage.setItem("processData", JSON.stringify(dataToSave));
      alert("Processos salvos com sucesso!");
  
      // Agora, chama a função generatePdf passando os processos atualizados
      GeneratePdf(updatedProcesses); // Passa updatedProcesses para o gerador de PDF
  
    } catch (error) {
      console.error("Erro ao salvar os processos:", error);
      alert("Erro ao salvar os processos.");
    }
  };
  


  const handleTableChange = (table, setTableData, rowIndex, colIndex, value, isCodingRulesTable = false) => {
    const updatedTable = [...table];
    updatedTable[rowIndex][colIndex] = value;

    if (!isCodingRulesTable) {
      const isLastRowFilled = updatedTable[updatedTable.length - 1].every(
        (cell) => cell.trim() !== ""
      );

      if (isLastRowFilled) {
        updatedTable.push(new Array(updatedTable[0].length).fill(""));
      }
    }

    setTableData(updatedTable);
  };

  const handleAddList = () => {
    if (!listName.trim()) {
      alert("O nome da lista é obrigatório!");
      return;
    }

    const updatedProcesses = [...processes];
    const activeProcess = updatedProcesses[activeTab];
    activeProcess.lists = [...(activeProcess.lists || []), { name: listName, table: [["", ""]] }];

    setProcesses(updatedProcesses); // Atualiza o estado dos processos
    setListName(""); // Limpa o campo do nome da lista
  };

  const handleAddListSimple = () => {
    if (!listName.trim()) {
      alert("O nome da lista é obrigatório!");
      return;
    }

    const updatedProcesses = [...processes];
    const activeProcess = updatedProcesses[activeTab];
    activeProcess.lists = [
      ...(activeProcess.lists || []),
      { name: listName, table: [[""]] }, // Lista simples com uma coluna
    ];

    setProcesses(updatedProcesses); // Atualiza o estado dos processos
    setListName(""); // Limpa o campo do nome da lista
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleGenerateWord = () => {
    try {
      WordDocument(formData, processes);
    } catch (error) {
      console.error("Erro ao gerar Word:", error);
    }

    handleMenuClose();
  };

  const handleGeneratePDF = () => {
    try {
      GeneratePdf(formData, processes); // Chama a função de geração de PDF com os dados do formulário e processos
      console.log("PDF gerado com sucesso!");
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
      alert("Erro ao gerar o PDF.");
    }
    handleMenuClose();
  };

  const handleGenerateExcel = () => {
    console.log("Gerar Excel com listas");
    handleMenuClose();
  };

  const handleGenerateJSON = () => {
    console.log("Gerar JSON com listas");

    try {
      const jsonOutput = generateJsonPayload(processes); // Chamando a função generateJson
      console.log(jsonOutput); // Exibindo o JSON gerado no console
      handleMenuClose();
    } catch (error) {
      console.error("Erro ao gerar JSON:", error);
      alert("Erro ao gerar JSON.");
    }
  };

  const handleAddProcess = () => {
    const newProcess = {
      processName: formData.processName?.trim() || `Processo ${processes.length + 1}`,
      codingRulesTable: [["", ""]],
      detailsTable: [["", "", "", "", ""]],
      listTable: [["", ""]],
      actionsTable: [["", "", "", "", ""]],
      preview: formData.preview || "",
      creation: formData.creation || "",
      notification: formData.notification || "",
      image: formData.image || null,
      imagePreview: formData.image
        ? URL.createObjectURL(formData.image)
        : null,
    };

    setProcesses((prevProcesses) => [...prevProcesses, newProcess]);
    setActiveTab(processes.length);

    setFormData((prevFormData) => ({
      ...prevFormData,
      processName: "",
      preview: "",
      creation: "",
      notification: "",
      image: null,
    }));
  };

  const handleFieldChange = (field, value) => {
    setProcesses((prevProcesses) => {
      const updatedProcesses = [...prevProcesses];
      updatedProcesses[activeTab] = {
        ...updatedProcesses[activeTab],
        [field]: value,
      };
      return updatedProcesses;
    });
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const generateDocument = () => {
    WordDocument(formData, { codingRulesTable, detailsTable });
  };

  const currentProcess = processes[activeTab] || {};

  return (
    <div className="container">
      <header>
        <IconButton
          aria-label="more"
          aria-controls="menu"
          aria-haspopup="true"
          onClick={handleMenuOpen}
        >
          <MoreVertIcon />
        </IconButton>
        <Menu
          id="menu"
          anchorEl={anchorEl}
          open={isMenuOpen}
          onClose={handleMenuClose}
        >
          <MenuItem onClick={handleGenerateWord}>Gerar Word</MenuItem>
          <MenuItem onClick={handleGeneratePDF}>Gerar PDF</MenuItem>
          <MenuItem onClick={handleGenerateExcel}>Gerar Excel com listas</MenuItem>
          <MenuItem onClick={handleGenerateJSON}>Gerar JSON com listas</MenuItem>
        </Menu>
      </header>

      {/* Renderiza o FormComponent */}
      <FormComponent formData={formData} setFormData={setFormData} />


      <form>
        <label>
          Nome Processo:
          <input
            type="text"
            name="processName"
            value={formData.processName}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                processName: e.target.value,
              }))
            }
          />
        </label>
        <button type="button" onClick={handleAddProcess}>
          Adicionar Processo
        </button>
      </form>

      {/* Renderiza as abas para os processos */}
      <Box sx={{ width: "100%" }}>
        <Tabs value={activeTab} onChange={handleTabChange} aria-label="process-tabs">
          {processes.map((process, index) => (
            <Tab
              key={index}
              label={
                <div style={{ display: "flex", alignItems: "center" }}>
                  <input
                    type="text"
                    value={process.processName}
                    onChange={(e) => {
                      const updatedProcesses = [...processes];
                      updatedProcesses[index].processName = e.target.value;
                      setProcesses(updatedProcesses);
                    }}
                    style={{
                      border: "none",
                      backgroundColor: "transparent",
                      width: "100%",
                      maxWidth: "150px",
                      textAlign: "center",
                    }}
                  />
                </div>
              }
            />
          ))}
        </Tabs>

        {processes.map((process, index) => (
          <div
            role="tabpanel"
            hidden={activeTab !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            key={index}
          >
            {activeTab === index && (
              <Box sx={{ p: 3 }}>
                {process.processName === "Objetivo e Escopo" && (
                  <ObjectiveScopeForm
                    formData={process}
                    handleInputChange={(e) => handleInputChange(e, index)}
                  />
                )}

                {process.processName === "Notificações, Views e Relatórios" && (
                  <NotificationComponent
                    notifications={processes[activeTab]?.notifications || []}
                    setNotifications={(updatedNotifications) => {
                      setProcesses((prevProcesses) => {
                        const updatedProcesses = [...prevProcesses];
                        updatedProcesses[activeTab].notifications = updatedNotifications;
                        return updatedProcesses;
                      });
                    }}
                  />
                )}

                {process.processName !== "Objetivo e Escopo" &&
                  process.processName !== "Notificações, Views e Relatórios" && (
                    <>
                      <h4>Regra de Codificação</h4>
                      <DynamicTable
                        tableData={process.codingRulesTable}
                        setTableData={(newTable) => {
                          const updatedProcesses = [...processes];
                          updatedProcesses[index].codingRulesTable = newTable;
                          setProcesses(updatedProcesses);
                        }}
                        columns={["Regra", "Exemplo"]}
                        handleCellChange={(rowIndex, colIndex, value) =>
                          handleTableChange(
                            process.codingRulesTable,
                            (newTable) => {
                              const updatedProcesses = [...processes];
                              updatedProcesses[index].codingRulesTable = newTable;
                              setProcesses(updatedProcesses);
                            },
                            rowIndex,
                            colIndex,
                            value
                          )
                        }
                        isCodingRulesTable={true} // Impede a adição de linhas nesta tabela
                      />

                      <h4>Metadados</h4>
                      <DynamicTable
                        tableData={process.detailsTable}
                        setTableData={(newTable) => {
                          const updatedProcesses = [...processes];
                          updatedProcesses[index].detailsTable = newTable;
                          setProcesses(updatedProcesses);
                        }}
                        columns={["Nome", "Tipo", "Obrigatório?", "Aparece nas atividades", "Obs"]}
                        handleCellChange={(rowIndex, colIndex, value) =>
                          handleTableChange(
                            process.detailsTable,
                            (newTable) => {
                              const updatedProcesses = [...processes];
                              updatedProcesses[index].detailsTable = newTable;
                              setProcesses(updatedProcesses);
                            },
                            rowIndex,
                            colIndex,
                            value
                          )
                        }
                        isMetadadosTable={true} // Certifique-se de passar isso apenas para a tabela de Metadados
                      />

                      <h2>Listas</h2>
                      <div>
                        <label>
                          <input
                            type="text"
                            value={listName}
                            placeholder="Nome da Lista:"
                            onChange={(e) => setListName(e.target.value)}
                          />
                        </label>
                        <button type="button" onClick={handleAddListSimple}>
                          Lista
                        </button>
                        <button type="button" onClick={handleAddList}>
                          Lista Sigla
                        </button>
                      </div>

                      {process.lists?.length > 0 && (
                        <Box sx={{ width: "100%", overflowX: "auto" }}>
                          <Tabs
                            value={process.activeListTab || 0}
                            onChange={(event, newValue) => {
                              const updatedProcesses = [...processes];
                              updatedProcesses[index].activeListTab = newValue; // Salva o índice da aba ativa
                              setProcesses(updatedProcesses);
                            }}
                            aria-label="list-tabs"
                            variant="scrollable"
                            scrollButtons="auto" // Adiciona botões de rolagem automáticos
                          >
                            {process.lists.map((list, listIndex) => (
                              <Tab
                                key={listIndex}
                                label={
                                  <div style={{ display: "flex", alignItems: "center" }}>
                                    <input
                                      type="text"
                                      value={list.name}
                                      onChange={(e) => {
                                        const updatedProcesses = [...processes];
                                        updatedProcesses[index].lists[listIndex].name = e.target.value;
                                        setProcesses(updatedProcesses);
                                      }}
                                      style={{
                                        border: "none",
                                        backgroundColor: "transparent",
                                        width: "100%",
                                        maxWidth: "100px",
                                        textAlign: "center",
                                        fontSize: "inherit",
                                      }}
                                    />
                                    <button
                                      onClick={() => {
                                        const confirmDelete = window.confirm(
                                          "Você tem certeza que deseja excluir esta lista?"
                                        );
                                        if (confirmDelete) {
                                          const updatedProcesses = [...processes];
                                          updatedProcesses[index].lists.splice(listIndex, 1);
                                          setProcesses(updatedProcesses);
                                        }
                                      }}
                                      style={{
                                        border: "none",
                                        background: "none",
                                        cursor: "pointer",
                                      }}
                                    >
                                      <DeleteIcon style={{ color: "red" }} />
                                    </button>
                                  </div>
                                }
                              />
                            ))}
                          </Tabs>

                          {process.lists.map((list, listIndex) => (
                            <div
                              role="tabpanel"
                              hidden={(process.activeListTab || 0) !== listIndex}
                              id={`list-tabpanel-${listIndex}`}
                              aria-labelledby={`list-tab-${listIndex}`}
                              key={listIndex}
                            >
                              {(process.activeListTab || 0) === listIndex && (
                                <Box sx={{ p: 3 }}>
                                  <DynamicTable
                                    tableData={list.table}
                                    setTableData={(newTable) => {
                                      const updatedProcesses = [...processes];
                                      updatedProcesses[index].lists[listIndex].table = newTable;
                                      setProcesses(updatedProcesses);
                                    }}
                                    columns={list.table[0].length === 1 ? ["Item"] : ["Sigla", "Nome"]}
                                    handleCellChange={(rowIndex, colIndex, value) =>
                                      handleTableChange(
                                        list.table,
                                        (newTable) => {
                                          const updatedProcesses = [...processes];
                                          updatedProcesses[index].lists[listIndex].table = newTable;
                                          setProcesses(updatedProcesses);
                                        },
                                        rowIndex,
                                        colIndex,
                                        value
                                      )
                                    }
                                  />
                                </Box>
                              )}
                            </div>
                          ))}
                        </Box>
                      )}

                      <div>
                        <label>
                          <h2>Fluxograma</h2>
                          <input type="file" accept="image/*" onChange={handleImageUpload} />
                        </label>
                        {currentProcess.imagePreview && (
                          <div className="image-preview">
                            <img
                              src={currentProcess.imagePreview}
                              alt="Pré-visualização"
                            />
                          </div>
                        )}
                      </div>

                      <h4>ATIVIDADES / AÇÕES / RESPONSÁVEIS</h4>
                      <DynamicTable
                        tableData={process.actionsTable}
                        setTableData={(newTable) => {
                          const updatedProcesses = [...processes];
                          updatedProcesses[index].actionsTable = newTable;
                          setProcesses(updatedProcesses);
                        }}
                        columns={["Atividade", "Ações", "Responsáveis", "Prazo", "Obs"]}
                        handleCellChange={(rowIndex, colIndex, value) =>
                          handleTableChange(
                            process.actionsTable,
                            (newTable) => {
                              const updatedProcesses = [...processes];
                              updatedProcesses[index].actionsTable = newTable;
                              setProcesses(updatedProcesses);
                            },
                            rowIndex,
                            colIndex,
                            value
                          )
                        }
                      />

                      <h2>Permissões</h2>
                      <label>
                        Visualização:
                        <input
                          type="text"
                          name="preview"
                          value={currentProcess.preview || ""}
                          onChange={(e) => handleFieldChange("preview", e.target.value)}
                        />
                      </label>
                      <label>
                        Criação:
                        <input
                          type="text"
                          name="creation"
                          value={currentProcess.creation || ""}
                          onChange={(e) => handleFieldChange("creation", e.target.value)}
                        />
                      </label>
                    </>
                  )}

                <button type="button" onClick={handleSave}>
                  Salvar Processos
                </button>
                {process.processName !== "Objetivo e Escopo" &&
                  process.processName !== "Notificações, Views e Relatórios" && (
                    <button
                      type="button"
                      onClick={() => handleDeleteProcess(index)}
                      style={{ marginBottom: "10px", backgroundColor: "red", color: "white" }}
                    >
                      Excluir Processo
                    </button>
                  )}
              </Box>
            )}
          </div>
        ))}
      </Box>
    </div>
  );
}

export default App;


