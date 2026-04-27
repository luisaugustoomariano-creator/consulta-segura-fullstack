import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

function normalizeName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

const names = [
  "Joao da Silva", "Maria Oliveira Santos", "Ana Paula Costa", "Pedro Henrique Lima", "Carla Mendes Rocha",
  "Rafael Almeida Souza", "Fernanda Martins Ribeiro", "Bruno Carvalho Pereira", "Juliana Fernandes Alves", "Marcos Vinicius Barbosa",
  "Larissa Gomes Nunes", "Thiago Moreira Lopes", "Patricia Azevedo Melo", "Gustavo Henrique Ramos", "Camila Torres Batista",
  "Diego Teixeira Moura", "Renata Castro Vieira", "Felipe Duarte Cardoso", "Aline Rodrigues Farias", "Eduardo Correia Pinto",
  "Sabrina Nascimento Dias", "Lucas Santiago Moraes", "Vanessa Freitas Campos", "Leandro Matos Cunha", "Isabela Monteiro Reis",
  "Roberto Tavares Neves", "Daniela Batista Araujo", "Andre Luiz Macedo", "Beatriz Cavalcante Brito", "Joao Carlos Silva"
];

const cities = [
  ["Sao Paulo", "SP"], ["Rio de Janeiro", "RJ"], ["Belo Horizonte", "MG"], ["Curitiba", "PR"], ["Salvador", "BA"],
  ["Fortaleza", "CE"], ["Recife", "PE"], ["Goiania", "GO"], ["Porto Alegre", "RS"], ["Manaus", "AM"]
];

const roles = ["Servidor", "Analista", "Coordenador", "Tecnico", "Auditor", "Supervisor"];

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);

  await prisma.user.upsert({
    where: { email: "admin@demo.com" },
    update: {},
    create: {
      name: "Admin",
      email: "admin@demo.com",
      passwordHash,
      role: "ADMIN",
      agencyName: "Orgao Teste"
    }
  });

  for (let index = 0; index < names.length; index += 1) {
    const [city, state] = cities[index % cities.length];
    const fullName = names[index];
    const suffix = String(index + 1).padStart(2, "0");

    await prisma.person.upsert({
      where: { fullName },
      update: {},
      create: {
        fullName,
        normalizedName: normalizeName(fullName),
        city,
        state,
        company: `Empresa Publica ${suffix}`,
        role: roles[index % roles.length],
        documentMasked: `***.${suffix}3.${suffix}56-**`,
        emailMasked: `pessoa${suffix}@exemplo.local`,
        phoneMasked: `(${10 + (index % 80)}) 9****-${String(1000 + index).slice(-4)}`,
        motherName: `Mae Simulada ${suffix}`,
        fatherName: `Pai Simulado ${suffix}`,
        sourceName: "Base Simulada"
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
