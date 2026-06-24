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
    message.textContent = "Podaj imię oraz nazwisko";
    tenantName.focus();
    return;
  }
  if (tenantPhone.value.trim() === "") {
    message.textContent = "Podaj nr telefonu";
    tenantPhone.focus();
    return;
  }
  if (tenantEmail.value.trim() === "") {
    message.textContent = "Podaj email";
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

  message.textContent = "Pomyślnie dodano lokatora";
}

addTenant.addEventListener("click", addNewTenant);

function addNewProperty() {
  if (propertyName.value.trim() === "") {
    message.textContent = "Nazwa nie może być pusta";
    propertyName.focus();
    return;
  }
  if (propertyAddress.value.trim() === "") {
    message.textContent = "Adres nie może być pusty";
    propertyAddress.focus();
    return;
  }
  if (Number(propertyRent.value) <= 0) {
    message.textContent = "Czynsz musi być większy od 0";
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

  message.textContent = "Mieszkanie dodane";
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

  for (const property of propertiesToRender) {
    const card = document.createElement("div");
    const name = document.createElement("p");
    const address = document.createElement("p");
    const rent = document.createElement("p");
    const tenantInfo = document.createElement("p");
    const hr = document.createElement("hr");
    const disengageTenant = document.createElement("button");
    const deleteButton = document.createElement("button");

    name.textContent = `Nazwa: ${property.name}`;
    address.textContent = `Adres: ${property.address}`;
    rent.textContent = `Czynsz: ${property.rent} zł`;

    if (property.tenantId === null) {
      tenantInfo.textContent = "Brak najemcy";
    } else {
      const tenant = findTenantById(property.tenantId);

      if (tenant) {
        tenantInfo.textContent = `Najemca: ${tenant.name}`;
      } else {
        tenantInfo.textContent = "Najemca nieznaleziony";
      }
      disengageTenant.textContent = "Odłącz najemcę";
      disengageTenant.addEventListener("click", () => {
        property.tenantId = null;

        saveData();
        renderProperties();
        renderAssignForm();
        renderStats();
        message.textContent = "Najemca odłączony";
      });
      card.appendChild(disengageTenant);
    }

    deleteButton.textContent = "Usuń nieruchomość";

    deleteButton.addEventListener("click", () => {
      properties = properties.filter(
        (propertyFilter) => propertyFilter.id !== property.id,
      );
      saveData();
      renderProperties();
      renderAssignForm();
      renderStats();
      message.textContent = "Nieruchomość usunięta";
    });
    card.appendChild(deleteButton);
    card.appendChild(name);
    card.appendChild(address);
    card.appendChild(rent);
    card.appendChild(tenantInfo);
    card.appendChild(hr);

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

  for (const tenant of tenants) {
    const card = document.createElement("div");
    const name = document.createElement("p");
    const phone = document.createElement("p");
    const email = document.createElement("p");
    const hr = document.createElement("hr");
    const deleteButton = document.createElement("button");

    name.textContent = `Imie i Nazwisko: ${tenant.name}`;
    phone.textContent = `Nr tel.: ${tenant.phone}`;
    email.textContent = `email: ${tenant.email}`;

    deleteButton.textContent = "Usuń najemcę";

    deleteButton.addEventListener("click", () => {
      const isAssigned = isTenantAssigned(tenant.id);

      if (isAssigned) {
        alert("Nie możesz usunąć przypisanego najemcy");
        return;
      } else {
        tenants = tenants.filter(
          (tenantFilter) => tenantFilter.id !== tenant.id,
        );
        saveData();
        renderTenants();
        renderAssignForm();
        renderStats();
        message.textContent = "Najemca usunięty";
      }
    });

    card.appendChild(name);
    card.appendChild(phone);
    card.appendChild(email);
    card.appendChild(deleteButton);
    card.appendChild(hr);

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
    option.textContent = "Brak wolnych mieszkań";
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
    option.textContent = "Brak wolnych najemców";
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
    message.textContent = "Brak dostępnego mieszkania albo najemcy";
    return;
  }

  const isTenantAlreadyAssigned = properties.some(
    (property) => property.tenantId === tenantId,
  );

  if (isTenantAlreadyAssigned) {
    message.textContent = `Ten najemca jest już przypisany do mieszkania`;
    return;
  }

  const foundTenant = tenants.find((tenant) => tenant.id === tenantId);
  if (!foundTenant) {
    message.textContent = "Nie znaleziono najemcy";
    return;
  }

  const foundProperty = properties.find(
    (property) => property.id === propertyId,
  );
  if (foundProperty) {
    foundProperty.tenantId = tenantId;
  } else {
    message.textContent = "Nie znaleziono mieszkania";
    return;
  }

  saveData();
  renderProperties();
  renderAssignForm();
  renderStats();

  message.textContent = "Najemca przypisany";
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

loadData();

renderAssignForm();
renderProperties();
renderTenants();
renderStats();
