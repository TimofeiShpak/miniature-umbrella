async function apiMethod(method, url, body) {
  if (method === "GET") {
    const response = await fetch(url, {
      method: "GET",
      headers: { "Accept": "application/json" }
    });
    if (response.ok === true) {
      let data = await response.json();
      return data
    } else {
      return null;
    }
  } else if (method === "POST") {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Accept": "application/json", "Content-Type": "application/json" },
      body: JSON.stringify(body)
    });
    if (response.ok === true) {
        let data = await response.json();
        return data;
    } else {
      return null;
    }
  }
}

export const api = {

  getSubjects: async () => {
    return await apiMethod("GET", "/getSubjects")
  },

  getProgramNames: async () => {
    return await apiMethod("GET", "/getProgramNames")
  },

  getProgramsWithoutSubjects: async () => {
    return await apiMethod("GET", "/getProgramsWithoutSubjects")
  },

  saveSubjects: async (dto) => {
    return await apiMethod("POST", "/saveSubjects", dto)
  },

  getProgramByName: async (name) => {
    return await apiMethod("POST", "/getProgramByName", { name })
  },

  saveNewSubjects: async (subjects, name) => {
    return await apiMethod("POST", "/saveNewSubjects", { subjects, name })
  },

  deleteProgram: async (id) => {
    return await apiMethod("POST", "/deleteProgram", { id })
  },

}