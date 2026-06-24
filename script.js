const propertiesList = document.getElementById("propertiesList");
const tenantsList = document.getElementById("tenantsList");
const message = document.getElementById("message");

const propertySelect = document.getElementById("propertySelect");
const tenantSelect = document.getElementById("tenantSelect");
const assignTenant = document.getElementById("assignTenant");

const propertyName = document.getElementById("propertyName");
const propertyAddress = document.getElementById("propertyAddress");
const propertyRent = document.getElementById("propertyRent");
const addProperty = document.getElementById("addProperty");

const tenantName = document.getElementById("tenantName");
const tenantPhone = document.getElementById("tenantPhone");
const tenantEmail = document.getElementById("tenantEmail");
const addTenant = document.getElementById("addTenant");

const totalProperties = document.getElementById("totalProperties");
const occupiedProperties = document.getElementById("occupiedProperties");
const freeProperties = document.getElementById("freeProperties");
const totalRent = document.getElementById("totalRent");

const showAllProperties = document.getElementById("showAllProperties");
const showFreeProperties = document.getElementById("showFreeProperties");
const showOccupiedProperties = document.getElementById(
  "showOccupiedProperties",
);
const propertySearch = document.getElementById("propertySearch");
const tenantSearch = document.getElementById("tenantSearch");

let currentPropertyFilter = "all";

let tenants = [
  {
    id: "t1",
    name: "Jan Kowalski",
    phone: "501-234-567",
    email: "jan.kowalski@example.com",
  },
  {
    id: "t2",
    name: "Anna Nowak",
    phone: "502-345-678",
    email: "anna.nowak@example.com",
  },
  {
    id: "t3",
    name: "Piotr Zieliński",
    phone: "503-456-789",
    email: "piotr.zielinski@example.com",
  },
  {
    id: "t4",
    name: "Maria Wiśniewska",
    phone: "504-567-890",
    email: "maria.wisniewska@example.com",
  },
];

let properties = [
  {
    id: "p1",
    name: "Apartment A",
    address: "Main Street 10, Kraków",
    rent: 2500,
    tenantId: "t1",
  },
  {
    id: "p2",
    name: "Apartment B",
    address: "Green Avenue 5, Kraków",
    rent: 3200,
    tenantId: null,
  },
  {
    id: "p3",
    name: "Studio C",
    address: "River Street 18, Warszawa",
    rent: 2100,
    tenantId: "t2",
  },
  {
    id: "p4",
    name: "Loft D",
    address: "Old Town 3, Wrocław",
    rent: 4100,
    tenantId: null,
  },
  {
    id: "p5",
    name: "Apartment E",
    address: "Parkowa 7, Gdańsk",
    rent: 2900,
    tenantId: "t3",
  },
];

function saveData() {
  localStorage.setItem("properties", JSON.stringify(properties));
  localStorage.setItem("tenants", JSON.stringify(tenants));
}

function loadData() {
  const loadedProperties = localStorage.getItem("properties");

  if (loadedProperties) {
    properties = JSON.parse(loadedProperties);
  }

  const loadedTenants = localStorage.getItem("tenants");

  if (loadedTenants) {
    tenants = JSON.parse(loadedTenants);
  }
}

function renderStats() {
  const total = properties.length;
  const occupied = properties.filter(
    (property) => property.tenantId !== null,
  ).length;
  const propertiesFree = total - occupied;
  const rentSum = properties.reduce((sum, property) => {
    return sum + property.rent;
  }, 0);

  totalProperties.textContent = total;
  occupiedProperties.textContent = occupied;
  freeProperties.textContent = propertiesFree;
  totalRent.textContent = rentSum;
}

function addNewTenant() {
  if (tenantName.value.trim() === "") {
    setMessage("Enter full name");
    tenantName.focus();
    return;
  }
  if (tenantPhone.value.trim() === "") {
    setMessage("Enter phone number");
    tenantPhone.focus();
    return;
  }
  if (tenantEmail.value.trim() === "") {
    setMessage("Enter email");
    tenantEmail.focus();
    return;
  }

  const newId = crypto.randomUUID();

  tenants.push({
    id: newId,
    name: tenantName.value.trim(),
    phone: tenantPhone.value.trim(),
    email: tenantEmail.value.trim(),
  });

  saveData();
  renderTenants();
  renderAssignForm();
  renderStats();

  clearTenantForm();

  setMessage("Tenant added successfully");
}

addTenant.addEventListener("click", addNewTenant);

function addNewProperty() {
  if (propertyName.value.trim() === "") {
    setMessage("Property name cannot be empty");
    propertyName.focus();
    return;
  }
  if (propertyAddress.value.trim() === "") {
    setMessage("Address cannot be empty");
    propertyAddress.focus();
    return;
  }
  if (Number(propertyRent.value) <= 0) {
    setMessage("Rent must be greater than 0");
    propertyRent.focus();
    return;
  }

  const newId = crypto.randomUUID();

  properties.push({
    id: newId,
    name: propertyName.value.trim(),
    address: propertyAddress.value.trim(),
    rent: Number(propertyRent.value),
    tenantId: null,
  });

  saveData();
  renderProperties();
  renderAssignForm();
  renderStats();

  clearPropertyForm();

  setMessage("Property added successfully");
}

function clearPropertyForm() {
  propertyName.value = "";
  propertyAddress.value = "";
  propertyRent.value = "";
  propertyName.focus();
}

function clearTenantForm() {
  tenantName.value = "";
  tenantPhone.value = "";
  tenantEmail.value = "";
  tenantName.focus();
}

addProperty.addEventListener("click", addNewProperty);

function renderProperties() {
  propertiesList.replaceChildren();

  let propertiesToRender = [];

  if (currentPropertyFilter === "all") {
    propertiesToRender = properties;
  } else if (currentPropertyFilter === "free") {
    propertiesToRender = properties.filter(
      (property) => property.tenantId === null,
    );
  } else if (currentPropertyFilter === "occupied") {
    propertiesToRender = properties.filter(
      (property) => property.tenantId !== null,
    );
  }

  const query = propertySearch.value.trim().toLowerCase();

  if (query !== "") {
    propertiesToRender = propertiesToRender.filter((property) => {
      return (
        property.name.toLowerCase().includes(query) ||
        property.address.toLowerCase().includes(query)
      );
    });
  }

  for (const property of propertiesToRender) {
    const card = document.createElement("div");
    const name = document.createElement("p");
    const address = document.createElement("p");
    const rent = document.createElement("p");
    const tenantInfo = document.createElement("p");
    const disengageTenant = document.createElement("button");
    const deleteButton = document.createElement("button");

    name.textContent = `Nazwa: ${property.name}`;
    address.textContent = `Adres: ${property.address}`;
    rent.textContent = `Czynsz: ${property.rent} zł`;

    card.appendChild(name);
    card.appendChild(address);
    card.appendChild(rent);
    card.appendChild(tenantInfo);

    if (property.tenantId === null) {
      tenantInfo.textContent = "No tenant";
    } else {
      const tenant = findTenantById(property.tenantId);

      if (tenant) {
        tenantInfo.textContent = `Tenant: ${tenant.name}`;
      } else {
        tenantInfo.textContent = "Tenant not found";
      }
      disengageTenant.textContent = "Unassign tenant";
      disengageTenant.addEventListener("click", () => {
        const confirmed = confirm(
          "Are you sure you want to unassign this tenant?",
        );
        if (!confirmed) {
          return;
        }

        property.tenantId = null;

        saveData();
        renderProperties();
        renderAssignForm();
        renderStats();
        setMessage("Tenant unassigned");
      });
      card.appendChild(disengageTenant);
    }

    deleteButton.textContent = "Delete property";

    deleteButton.addEventListener("click", () => {
      const confirmed = confirm(
        "Are you sure you want to delete this property?",
      );

      if (!confirmed) {
        return;
      }

      properties = properties.filter(
        (propertyFilter) => propertyFilter.id !== property.id,
      );
      saveData();
      renderProperties();
      renderAssignForm();
      renderStats();
      setMessage("Property deleted");
    });

    deleteButton.className =
      "rounded-lg bg-amber-200 px-3 py-1 mx-2 text-sm font-medium text-white hover:bg-amber-300";
    disengageTenant.className =
      "rounded-lg bg-red-200 px-3 py-1 text-sm font-medium text-white hover:bg-red-300 ";

    card.appendChild(deleteButton);

    card.className =
      "rounded-lg border border-slate-200 bg-white p-4 shadow-sm space-y-1 mt-5";

    propertiesList.appendChild(card);
  }
}

function isTenantAssigned(tenantId) {
  return properties.some((property) => property.tenantId === tenantId);
}

function findTenantById(tenantId) {
  return tenants.find((tenant) => tenant.id === tenantId);
}

function renderTenants() {
  tenantsList.replaceChildren();

  let tenantsToRender = tenants;

  const query = tenantSearch.value.trim().toLowerCase();

  if (query !== "") {
    tenantsToRender = tenantsToRender.filter((tenant) => {
      return (
        tenant.name.toLowerCase().includes(query) ||
        tenant.phone.toLowerCase().includes(query) ||
        tenant.email.toLowerCase().includes(query)
      );
    });
  }

  for (const tenant of tenantsToRender) {
    const card = document.createElement("div");
    const name = document.createElement("p");
    const phone = document.createElement("p");
    const email = document.createElement("p");
    const deleteButton = document.createElement("button");

    name.textContent = `Full name: ${tenant.name}`;
    phone.textContent = `Phone: ${tenant.phone}`;
    email.textContent = `Email: ${tenant.email}`;

    deleteButton.textContent = "Delete tenant";

    deleteButton.addEventListener("click", () => {
      const isAssigned = isTenantAssigned(tenant.id);

      if (isAssigned) {
        setMessage("You cannot delete an assigned tenant");
        return;
      } else {
        const confirmed = confirm(
          "Are you sure you want to delete this tenant?",
        );
        if (!confirmed) {
          return;
        }

        tenants = tenants.filter(
          (tenantFilter) => tenantFilter.id !== tenant.id,
        );
        saveData();
        renderTenants();
        renderAssignForm();
        renderStats();
        setMessage("Tenant deleted");
      }
    });

    deleteButton.className =
      "rounded-xl bg-red-200 px-3 py-1 text-sm  font-medium text-white hover:bg-red-300 mt-1";

    card.appendChild(name);
    card.appendChild(phone);
    card.appendChild(email);
    card.appendChild(deleteButton);

    card.className =
      "rounded-xl border border-slate-200 bg-white p-4 shadow-sm space-y-1 mt-5";

    tenantsList.appendChild(card);
  }
}

function renderAssignForm() {
  propertySelect.replaceChildren();
  tenantSelect.replaceChildren();

  const availableProperties = properties.filter(
    (property) => property.tenantId === null,
  );

  const availableTenants = tenants.filter((tenant) => {
    const isAssigned = isTenantAssigned(tenant.id);
    return !isAssigned;
  });

  let canAssign = true;

  if (availableProperties.length === 0) {
    const option = document.createElement("option");
    option.textContent = "No free properties";
    option.value = "";
    propertySelect.appendChild(option);

    canAssign = false;
  } else {
    availableProperties.forEach((property) => {
      const option = document.createElement("option");
      option.textContent = `${property.name} | ${property.address}`;
      option.value = property.id;
      propertySelect.appendChild(option);
    });
  }

  if (availableTenants.length === 0) {
    const option = document.createElement("option");
    option.textContent = "No available tenants";
    option.value = "";
    tenantSelect.appendChild(option);

    canAssign = false;
  } else {
    availableTenants.forEach((tenant) => {
      const option = document.createElement("option");
      option.textContent = tenant.name;
      option.value = tenant.id;
      tenantSelect.appendChild(option);
    });
  }

  assignTenant.disabled = !canAssign;
}

function assignTenantToProperty() {
  const propertyId = propertySelect.value;
  const tenantId = tenantSelect.value;

  if (propertyId === "" || tenantId === "") {
    setMessage("No property or tenant available");
    return;
  }

  const isTenantAlreadyAssigned = properties.some(
    (property) => property.tenantId === tenantId,
  );

  if (isTenantAlreadyAssigned) {
    setMessage("This tenant is already assigned to a property");
    return;
  }

  const foundTenant = tenants.find((tenant) => tenant.id === tenantId);
  if (!foundTenant) {
    setMessage("Tenant not found");
    return;
  }

  const foundProperty = properties.find(
    (property) => property.id === propertyId,
  );
  if (foundProperty) {
    foundProperty.tenantId = tenantId;
  } else {
    setMessage("Property not found");
    return;
  }

  saveData();
  renderProperties();
  renderAssignForm();
  renderStats();

  setMessage("Tenant assigned");
}

function setMessage(textMessage) {
  message.textContent = textMessage;
  message.classList.remove("hidden");

  setTimeout(() => {
    message.classList.add("hidden");
  }, 3000);
}

assignTenant.addEventListener("click", assignTenantToProperty);

showAllProperties.addEventListener("click", () => {
  currentPropertyFilter = "all";
  renderProperties();
});

showFreeProperties.addEventListener("click", () => {
  currentPropertyFilter = "free";
  renderProperties();
});

showOccupiedProperties.addEventListener("click", () => {
  currentPropertyFilter = "occupied";
  renderProperties();
});

propertySearch.addEventListener("input", () => {
  renderProperties();
});

tenantSearch.addEventListener("input", () => {
  renderTenants();
});

loadData();

renderAssignForm();
renderProperties();
renderTenants();
renderStats();
