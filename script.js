const propertiesList = document.getElementById("propertiesList");
const tenantsList = document.getElementById("tenantsList");
const message = document.getElementById("message");

const propertySelect = document.getElementById("propertySelect");
const tenantSelect = document.getElementById("tenantSelect");
const assignTenant = document.getElementById("assignTenant");

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

function renderProperties() {
  propertiesList.replaceChildren();

  for (const property of properties) {
    const card = document.createElement("div");
    const name = document.createElement("p");
    const address = document.createElement("p");
    const rent = document.createElement("p");
    const tenantInfo = document.createElement("p");
    const hr = document.createElement("hr");
    const disengageTenant = document.createElement("button");

    name.textContent = `Nazwa: ${property.name}`;
    address.textContent = `Adres: ${property.address}`;
    rent.textContent = `Czynsz: ${property.rent} zł`;

    if (property.tenantId === null) {
      tenantInfo.textContent = "Brak najemcy";
    } else {
      const tenant = tenants.find((tenant) => tenant.id === property.tenantId);

      if (tenant) {
        tenantInfo.textContent = `Najemca: ${tenant.name}`;
      } else {
        tenantInfo.textContent = "Najemca nieznaleziony";
      }
      disengageTenant.textContent = "Odłącz najemcę";
      disengageTenant.addEventListener("click", () => {
        property.tenantId = null;
        renderProperties();
        renderAssignForm();
        message.textContent = "Najemca odłączony";
      });
      card.appendChild(disengageTenant);
    }

    card.appendChild(name);
    card.appendChild(address);
    card.appendChild(rent);
    card.appendChild(tenantInfo);
    card.appendChild(hr);

    propertiesList.appendChild(card);
  }
}

function renderTenants() {
  tenantsList.replaceChildren();

  for (const tenant of tenants) {
    const card = document.createElement("div");
    const name = document.createElement("p");
    const phone = document.createElement("p");
    const email = document.createElement("p");
    const hr = document.createElement("hr");

    name.textContent = `Imie i Nazwisko: ${tenant.name}`;
    phone.textContent = `Nr tel.: ${tenant.phone}`;
    email.textContent = `email: ${tenant.email}`;

    card.appendChild(name);
    card.appendChild(phone);
    card.appendChild(email);
    card.appendChild(hr);

    tenantsList.appendChild(card);
  }
}

function renderAssignForm() {
  propertySelect.replaceChildren();
  tenantSelect.replaceChildren();

  properties.forEach((property) => {
    const option = document.createElement("option");
    option.textContent = `${property.name} | ${property.address}`;
    option.value = property.id;
    propertySelect.appendChild(option);
  });

  tenants.forEach((tenant) => {
    const option = document.createElement("option");
    option.textContent = `${tenant.name}`;
    option.value = tenant.id;
    tenantSelect.appendChild(option);
  });
}

function assignTenantToProperty() {
  const propertyId = propertySelect.value;
  const tenantId = tenantSelect.value;

  const foundProperty = properties.find(
    (property) => property.id === propertyId,
  );
  if (foundProperty) {
    foundProperty.tenantId = tenantId;
  } else {
    message.textContent = "Nie znaleziono mieszkania";
    return;
  }

  const isTenantAlreadyAssigned = properties.some(
    (property) => property.tenantId === tenantId,
  );

  if (isTenantAlreadyAssigned) {
    message.textContent = `Ten najemca jest już przypisany do mieszkania`;
    return;
  }

  renderProperties();
  renderAssignForm();

  message.textContent = "Najemca przypisany";
}

assignTenant.addEventListener("click", assignTenantToProperty);

renderAssignForm();
renderProperties();
renderTenants();
