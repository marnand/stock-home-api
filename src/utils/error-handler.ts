export const errorHandler = (error: Error) => {
  console.error("Erro:", error);

  if (error.message.includes("not found")) {
    return {
      success: false,
      error: "Recurso não encontrado",
      code: "NOT_FOUND",
    };
  }

  if (error.message.includes("Unauthorized")) {
    return {
      success: false,
      error: "Não autorizado",
      code: "UNAUTHORIZED",
    };
  }

  if (error.message.includes("duplicate key")) {
    return {
      success: false,
      error: "Recurso duplicado",
      code: "DUPLICATE",
    };
  }

  return {
    success: false,
    error: error.message,
    code: "INTERNAL_ERROR",
  };
};

export const validateRequest = (
  data: any,
  requiredFields: string[]
): boolean => {
  for (const field of requiredFields) {
    if (!data[field]) {
      return false;
    }
  }
  return true;
};
