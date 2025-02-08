export const generateJsonPayload = (data) => {
  const { formData, processes } = data;

  const payload = {
    formData: {
      name: formData.name,
      analist: formData.analist,
      job: formData.job,
      sales: formData.sales,
      lowCoder: formData.lowCoder,
    },
    processes: processes.map((process) => {
      if (process.processName === "Objetivo e Escopo") {
        return {
          processName: process.processName,
          objective: process.objective,
          scope: process.scope,
        };
      }
      if (process.processName === "Notificações, Views e Relatórios") {
        return {
          processName: process.processName,
          notifications: process.notifications,
        };
      }

      return {
        processName: process.processName,
        codingRulesTable: process.codingRulesTable?.filter(
          (row) => row.some((cell) => cell !== "")
        ),
        detailsTable: process.detailsTable?.filter(
          (row) => row.some((cell) => cell !== "")
        ),
        lists: process.lists?.map((list) => ({
          name: list.name,
          table: list.table?.filter((row) => row.some((cell) => cell !== "")),
        })) || [],
        actionsTable: process.actionsTable?.filter(
          (row) => row.some((cell) => cell !== "")
        ),
        imagePreview: process.imagePreview,
        preview: process.preview,
        creation: process.creation,
        notification: process.notification,
      };
    }),
  };

  return payload;
};