import type {
  BillingEntity,
  ClientProjectWithCustomer,
  Customer,
  CustomerMessage,
  MaterialFolder,
  MaterialItem,
  ProjectApproval,
} from "@/lib/types";
import { contactInfo } from "@/lib/data/site-info";
import type { DemoApprovalStatus } from "@/features/customer-portal-demo/state/CustomerPortalDemoProvider";

// Fictional demo case, not checked against real businesses. Every visual
// asset below is a deliberately simple placeholder until the real graphics
// arrive — swap the files under public/images/demos/glanta-tradgard/ and
// nothing in this file needs to change:
//   primary-logo.svg        → final primary logotype
//   compact-logo.svg        → compact logo / standalone symbol
//   sketch-1.svg             → first early sketch (not chosen)
//   sketch-2.svg             → second early sketch (chosen direction)
//   moodboard.svg            → color/typography/reference moodboard
//   revised-logo.svg         → the approved, proportion-adjusted logo
//   application-jacket.svg   → logo on a dark work jacket
//   application-car.svg      → logo on a vehicle
//   digital-symbol.svg       → standalone symbol, digital export
//   usage-guide-draft.pdf    → short usage guide (under review)
//   usage-guide-final.pdf    → short usage guide (final delivery)
//   print-file.pdf           → print-ready vector file (final delivery)
const ASSET_BASE = "/images/demos/glanta-tradgard";

// Computed relative to "now" (not a fixed date) so the demo's timestamps
// always read as recent, however long after this was written someone opens
// it. Positive offsets are in the past, negative ones are in the future.
function isoOffsetDays(offsetDays: number, hour = 10): string {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - offsetDays);
  date.setUTCHours(hour, 0, 0, 0);
  return date.toISOString();
}

// The real data layer generates a signed downloadUrl per request; this demo
// has no storage bucket at all, so storagePath is already a plain public
// asset path and doubles as the downloadUrl components actually render.
export function withDemoDownloadUrl<T extends MaterialItem>(item: T): T & { downloadUrl: string | null } {
  return { ...item, downloadUrl: item.storagePath ?? null };
}

export const DEMO_PROJECT_ID = "demo-project-glanta";
export const DEMO_PENDING_APPROVAL_ID = "demo-approval-slutlig";

export const demoCustomer: Customer = {
  id: "demo-customer-glanta",
  name: "Elin Berg",
  company: "Glänta Trädgård",
  email: "elin@glanta-tradgard.se",
  createdAt: isoOffsetDays(29),
  updatedAt: isoOffsetDays(1),
};

export const demoAssignee: BillingEntity = {
  id: "demo-assignee-ada",
  name: "Ada",
  email: contactInfo.email,
  phone: contactInfo.whatsapp,
  fSkatt: true,
  isDefault: true,
  createdAt: isoOffsetDays(365),
  updatedAt: isoOffsetDays(365),
};

// Builds the one demo project — status/phase/milestone all reflect whether
// the visitor has approved the final delivery yet.
export function buildDemoProject(delivered: boolean): ClientProjectWithCustomer {
  return {
    id: DEMO_PROJECT_ID,
    title: "Ny visuell identitet för Glänta Trädgård",
    customerId: demoCustomer.id,
    customer: demoCustomer,
    assigneeEntityId: demoAssignee.id,
    assignee: demoAssignee,
    status: delivered ? "klar" : "vantar_pa_kund",
    overview: "Fiktivt demoprojekt — visar kundportalen med ett påhittat uppdrag.",
    customerUpdate: delivered
      ? "Slutleveransen är klar — logotyp, tillämpningar och användningsguide finns i materialbiblioteket."
      : "Slutversionen av logotypen och användningsguiden är redo för din granskning.",
    customerUpdateAt: isoOffsetDays(delivered ? 0 : 1),
    nextMilestoneLabel: "Slutlig logotyp och användningsguide",
    nextMilestoneDate: isoOffsetDays(-6).slice(0, 10),
    nextMilestoneDelivered: delivered,
    phaseLabels: ["Uppstart", "Riktning & skisser", "Bearbetning", "Din granskning", "Slutleverans"],
    phaseCurrent: delivered ? 4 : 3,
    createdAt: isoOffsetDays(29),
    updatedAt: isoOffsetDays(delivered ? 0 : 1),
  };
}

// ---- Material: folders ----

export const demoFolders: MaterialFolder[] = [
  {
    id: "folder-borja-har",
    customerId: demoCustomer.id,
    name: "Börja här",
    description: "Kort guide till projektets material och vilken logotyp du ska använda när.",
    position: 0,
    createdAt: isoOffsetDays(28),
    updatedAt: isoOffsetDays(28),
  },
  {
    id: "folder-riktning-skisser",
    customerId: demoCustomer.id,
    name: "Riktning och skisser",
    description: "Moodboard, tidiga skisser och den godkända bearbetningen.",
    position: 1,
    createdAt: isoOffsetDays(24),
    updatedAt: isoOffsetDays(8),
  },
  {
    id: "folder-slutversion",
    customerId: demoCustomer.id,
    name: "Slutversion för granskning",
    description: "Logotyppresentation, tillämpningar och användningsguide inför ditt sista godkännande.",
    position: 2,
    createdAt: isoOffsetDays(1),
    updatedAt: isoOffsetDays(1),
  },
  {
    id: "folder-digital",
    customerId: demoCustomer.id,
    name: "Digital användning",
    description: "Färdiga export­filer för webb, sociala kanaler och andra digitala ytor.",
    position: 3,
    createdAt: isoOffsetDays(1),
    updatedAt: isoOffsetDays(1),
  },
  {
    id: "folder-tryck",
    customerId: demoCustomer.id,
    name: "Tryck",
    description: "Tryckfärdiga filer för allt från visitkort till bildekal.",
    position: 4,
    createdAt: isoOffsetDays(1),
    updatedAt: isoOffsetDays(1),
  },
  {
    id: "folder-riktlinjer",
    customerId: demoCustomer.id,
    name: "Riktlinjer",
    description: "Färgkoder, friyta, storlek och bakgrundsval för logotypen.",
    position: 5,
    createdAt: isoOffsetDays(1),
    updatedAt: isoOffsetDays(1),
  },
];

// Folders that only appear once the final delivery is approved — everything
// else is visible from the moment the demo opens.
export const LOCKED_FOLDER_IDS = new Set(["folder-digital", "folder-tryck", "folder-riktlinjer"]);

function file(
  overrides: Partial<MaterialItem> & { id: string; folderId: string; title: string; filename: string; contentType: string },
): MaterialItem {
  return {
    customerId: demoCustomer.id,
    type: "file",
    visibility: "shared",
    deliveryStatus: "final",
    pinned: false,
    position: 0,
    storagePath: `${ASSET_BASE}/${overrides.filename}`,
    createdAt: isoOffsetDays(5),
    updatedAt: isoOffsetDays(5),
    ...overrides,
  };
}

function instruction(
  overrides: Partial<MaterialItem> & { id: string; folderId: string; title: string; bodyHtml: string },
): MaterialItem {
  return {
    customerId: demoCustomer.id,
    type: "instruction",
    visibility: "shared",
    deliveryStatus: "final",
    pinned: false,
    position: 0,
    createdAt: isoOffsetDays(28),
    updatedAt: isoOffsetDays(28),
    ...overrides,
  };
}

// ---- Material: items ----

export const itemBrief = instruction({
  id: "item-brief",
  folderId: "folder-borja-har",
  title: "Uppdragsbrief: Ny visuell identitet",
  position: 0,
  bodyHtml:
    "<p>Glänta Trädgård hjälper privatpersoner med plantering, beskärning och skötsel. Identiteten ska kännas varm, kunnig och genomarbetad — och logotypen måste framför allt synas tydligt på en mörk arbetsjacka, men också fungera på bilen, offerter och digitalt.</p>",
});

export const itemGuideIntro = instruction({
  id: "item-guide-intro",
  folderId: "folder-borja-har",
  title: "Så använder du biblioteket",
  pinned: true,
  position: 1,
  bodyHtml:
    "<p>Mapparna är ordnade efter var du är i processen: <strong>Riktning och skisser</strong> visar hur vi kom fram till logotypen, <strong>Slutversion för granskning</strong> är det som väntar på ditt godkännande just nu. När du har godkänt låses <strong>Digital användning</strong>, <strong>Tryck</strong> och <strong>Riktlinjer</strong> upp med de färdiga leveransfilerna.</p>",
});

export const itemRattLogotyp = instruction({
  id: "item-ratt-logotyp",
  folderId: "folder-borja-har",
  title: "Vilken logotyp ska jag använda?",
  position: 2,
  bodyHtml:
    "<p>Använd den <strong>primära logotypen</strong> där det finns gott om plats — offerter, hemsida, bilen. Använd den fristående <strong>symbolen</strong> i små format eller sociala kanaler, till exempel som profilbild.</p>",
});

export const itemMoodboard = file({
  id: "item-moodboard",
  folderId: "folder-riktning-skisser",
  title: "Moodboard: färg, typografi, referenser",
  description: "Skogsgrönt, varm benvit och en dämpad gul accent, tillsammans med typsnittsförslag.",
  filename: "moodboard.svg",
  contentType: "image/svg+xml",
  position: 0,
  createdAt: isoOffsetDays(24),
  updatedAt: isoOffsetDays(24),
});

export const itemSkiss1 = file({
  id: "item-skiss-1",
  folderId: "folder-riktning-skisser",
  title: "Skissförslag 1",
  filename: "sketch-1.svg",
  contentType: "image/svg+xml",
  position: 1,
  createdAt: isoOffsetDays(18),
  updatedAt: isoOffsetDays(18),
});

export const itemSkiss2 = file({
  id: "item-skiss-2",
  folderId: "folder-riktning-skisser",
  title: "Skissförslag 2 (vald riktning)",
  description: "En symbol som kombinerar ett G med en öppning mellan bladformer, tillsammans med ett ordmärke.",
  filename: "sketch-2.svg",
  contentType: "image/svg+xml",
  position: 2,
  createdAt: isoOffsetDays(18),
  updatedAt: isoOffsetDays(18),
});

export const itemBearbetadLogotyp = file({
  id: "item-bearbetad-logotyp",
  folderId: "folder-riktning-skisser",
  title: "Bearbetad logotyp — justerade proportioner",
  description: "Bokstäverna särades något och bladformerna gjordes större för bättre läsbarhet på avstånd.",
  filename: "revised-logo.svg",
  contentType: "image/svg+xml",
  position: 3,
  createdAt: isoOffsetDays(8),
  updatedAt: isoOffsetDays(8),
});

export const itemSlutligLogotyp = file({
  id: "item-slutlig-logotyp",
  folderId: "folder-slutversion",
  title: "Slutlig logotyp",
  description: "Primär logotyp, kompakt version och fristående symbol, samlade för granskning.",
  filename: "primary-logo.svg",
  contentType: "image/svg+xml",
  deliveryStatus: "review",
  pinned: true,
  position: 0,
  createdAt: isoOffsetDays(1),
  updatedAt: isoOffsetDays(1),
});

export const itemAnvandningsguideForslag = file({
  id: "item-anvandningsguide-forslag",
  folderId: "folder-slutversion",
  title: "Användningsguide (förslag)",
  filename: "usage-guide-draft.pdf",
  contentType: "application/pdf",
  deliveryStatus: "review",
  position: 1,
  createdAt: isoOffsetDays(1),
  updatedAt: isoOffsetDays(1),
});

export const itemTillampningJacka = file({
  id: "item-tillampning-jacka",
  folderId: "folder-slutversion",
  title: "Tillämpning: arbetsjacka",
  filename: "application-jacket.svg",
  contentType: "image/svg+xml",
  deliveryStatus: "review",
  position: 2,
  createdAt: isoOffsetDays(1),
  updatedAt: isoOffsetDays(1),
});

export const itemTillampningBil = file({
  id: "item-tillampning-bil",
  folderId: "folder-slutversion",
  title: "Tillämpning: bil",
  filename: "application-car.svg",
  contentType: "image/svg+xml",
  deliveryStatus: "review",
  position: 3,
  createdAt: isoOffsetDays(1),
  updatedAt: isoOffsetDays(1),
});

export const itemDigitalPrimar = file({
  id: "item-digital-primar",
  folderId: "folder-digital",
  title: "Primär logotyp — digital (SVG)",
  filename: "primary-logo.svg",
  contentType: "image/svg+xml",
  pinned: true,
  position: 0,
});

export const itemDigitalSymbol = file({
  id: "item-digital-symbol",
  folderId: "folder-digital",
  title: "Symbol fristående — digital (SVG)",
  description: "För profilbilder och andra ytor med lite plats, t.ex. Instagram.",
  filename: "digital-symbol.svg",
  contentType: "image/svg+xml",
  position: 1,
});

export const itemTryckfil = file({
  id: "item-tryckfil",
  folderId: "folder-tryck",
  title: "Tryckfil — vektor (PDF)",
  description: "Håller oavsett storlek, från visitkort till bildekal. Skicka den här till tryckeriet.",
  filename: "print-file.pdf",
  contentType: "application/pdf",
  pinned: true,
  position: 0,
});

export const itemRiktlinjer = file({
  id: "item-riktlinjer",
  folderId: "folder-riktlinjer",
  title: "Användningsguide — färg, friyta, storlek",
  filename: "usage-guide-final.pdf",
  contentType: "application/pdf",
  pinned: true,
  position: 0,
});

export const demoItemsAlwaysVisible: MaterialItem[] = [
  itemBrief,
  itemGuideIntro,
  itemRattLogotyp,
  itemMoodboard,
  itemSkiss1,
  itemSkiss2,
  itemBearbetadLogotyp,
  itemSlutligLogotyp,
  itemAnvandningsguideForslag,
  itemTillampningJacka,
  itemTillampningBil,
];

export const demoItemsUnlockedOnDelivery: MaterialItem[] = [
  itemDigitalPrimar,
  itemDigitalSymbol,
  itemTryckfil,
  itemRiktlinjer,
];

// ---- Approvals: the project's five review rounds ----

const approvalBrief: ProjectApproval = {
  id: "demo-approval-brief",
  customerId: demoCustomer.id,
  projectId: DEMO_PROJECT_ID,
  materialItemId: itemBrief.id,
  title: "Brief och behov",
  status: "approved",
  requestedAt: isoOffsetDays(28),
  decidedAt: isoOffsetDays(27),
  decidedByLabel: "Elin Berg",
  decisionNote: "Låter jättebra, kör på det här!",
  createdAt: isoOffsetDays(28),
  updatedAt: isoOffsetDays(27),
};

const approvalRiktning: ProjectApproval = {
  id: "demo-approval-riktning",
  customerId: demoCustomer.id,
  projectId: DEMO_PROJECT_ID,
  materialItemId: itemMoodboard.id,
  title: "Visuell riktning",
  status: "approved",
  requestedAt: isoOffsetDays(24),
  decidedAt: isoOffsetDays(22),
  decidedByLabel: "Elin Berg",
  decisionNote: "Älskar den gröna paletten — kör vidare på den!",
  createdAt: isoOffsetDays(24),
  updatedAt: isoOffsetDays(22),
};

const approvalSkiss: ProjectApproval = {
  id: "demo-approval-skiss",
  customerId: demoCustomer.id,
  projectId: DEMO_PROJECT_ID,
  materialItemId: itemSkiss2.id,
  title: "Första skissförslag",
  status: "approved",
  requestedAt: isoOffsetDays(18),
  decidedAt: isoOffsetDays(16),
  decidedByLabel: "Elin Berg",
  decisionNote: "Den här känns rätt, men jag vill att företagsnamnet syns tydligare.",
  createdAt: isoOffsetDays(18),
  updatedAt: isoOffsetDays(16),
};

const approvalBearbetad: ProjectApproval = {
  id: "demo-approval-bearbetad",
  customerId: demoCustomer.id,
  projectId: DEMO_PROJECT_ID,
  materialItemId: itemBearbetadLogotyp.id,
  title: "Bearbetad logotyp",
  status: "approved",
  requestedAt: isoOffsetDays(8),
  decidedAt: isoOffsetDays(6),
  decidedByLabel: "Elin Berg",
  decisionNote: "Nu känns det klart — bra jobbat!",
  createdAt: isoOffsetDays(8),
  updatedAt: isoOffsetDays(6),
};

const approvalSlutligBase: ProjectApproval = {
  id: DEMO_PENDING_APPROVAL_ID,
  customerId: demoCustomer.id,
  projectId: DEMO_PROJECT_ID,
  materialItemId: itemSlutligLogotyp.id,
  title: "Slutlig logotyp och användningsguide",
  message: "Sista granskningen innan vi sammanställer allt till slutleverans — hör av dig om något känns fel.",
  status: "pending",
  dueAt: isoOffsetDays(-6).slice(0, 10),
  requestedAt: isoOffsetDays(1),
  createdAt: isoOffsetDays(1),
  updatedAt: isoOffsetDays(1),
};

export const demoDecidedApprovals: ProjectApproval[] = [approvalBrief, approvalRiktning, approvalSkiss, approvalBearbetad];

// The final approval's status/decision fields come from the demo's mutable
// reducer state, not the static seed — this merges the two.
export function buildDemoApprovals(demo: {
  approvalStatus: DemoApprovalStatus;
  decisionNote?: string;
  decidedAt?: string;
}): ProjectApproval[] {
  const status = demo.approvalStatus === "assembling" ? "pending" : demo.approvalStatus;
  const finalApproval: ProjectApproval = {
    ...approvalSlutligBase,
    status,
    decidedAt: status !== "pending" ? demo.decidedAt : undefined,
    decidedByLabel: status !== "pending" ? "Elin Berg" : undefined,
    decisionNote: status !== "pending" ? demo.decisionNote : undefined,
    updatedAt: status !== "pending" ? (demo.decidedAt ?? approvalSlutligBase.updatedAt) : approvalSlutligBase.updatedAt,
  };
  return [...demoDecidedApprovals, finalApproval];
}

// ---- Messages ----

export const demoMessages: CustomerMessage[] = [
  {
    id: "msg-1",
    customerId: demoCustomer.id,
    authorRole: "customer",
    authorLabel: "Elin Berg",
    body: "Hej! Ville bara dubbelkolla att logotypen syns bra på en mörk arbetsjacka — det är där den kommer synas mest i vardagen.",
    createdAt: isoOffsetDays(9, 9),
  },
  {
    id: "msg-2",
    customerId: demoCustomer.id,
    authorRole: "admin",
    authorLabel: "Ada",
    body: "Absolut, vi har testat den mot en mörkgrön/svart jacka och den håller fint kontrastmässigt. Du hittar en bild på det i mappen \"Slutversion för granskning\".",
    createdAt: isoOffsetDays(9, 11),
  },
  {
    id: "msg-3",
    customerId: demoCustomer.id,
    authorRole: "customer",
    authorLabel: "Elin Berg",
    body: "Perfekt! En annan fråga — kan symbolen (utan text) användas ensam på Instagram, eller behöver ni alltid hela ordmärket?",
    createdAt: isoOffsetDays(5, 14),
  },
  {
    id: "msg-4",
    customerId: demoCustomer.id,
    authorRole: "admin",
    authorLabel: "Ada",
    body: "Symbolen fungerar jättebra fristående i sociala kanaler. Den finns som egen fil i biblioteket under \"Digital användning\" när slutleveransen är klar — fram tills dess ligger en förhandsversion i \"Slutversion för granskning\".",
    createdAt: isoOffsetDays(5, 15),
  },
  {
    id: "msg-5",
    customerId: demoCustomer.id,
    authorRole: "customer",
    authorLabel: "Elin Berg",
    body: "Vilken fil ska jag skicka vidare till tryckeriet när ni är klara?",
    createdAt: isoOffsetDays(3, 10),
  },
  {
    id: "msg-6",
    customerId: demoCustomer.id,
    authorRole: "admin",
    authorLabel: "Ada",
    body: "Då blir det tryckfilen i mappen \"Tryck\" — en vektorfil (PDF) som håller oavsett storlek, från visitkort till bildekal.",
    createdAt: isoOffsetDays(3, 11),
  },
  {
    id: "msg-7",
    customerId: demoCustomer.id,
    authorRole: "customer",
    authorLabel: "Elin Berg",
    body: "Vad har egentligen ändrats sen förra förslaget? Proportionerna känns lite annorlunda.",
    createdAt: isoOffsetDays(1, 16),
  },
  {
    id: "msg-8",
    customerId: demoCustomer.id,
    authorRole: "admin",
    authorLabel: "Ada",
    body: "Bra fråga — vi drog isär bokstäverna lite och gjorde bladformerna något större så att märket läses tydligare på avstånd, till exempel på bilen. Du ser skillnaden om du jämför \"Bearbetad logotyp\" mot det första skissförslaget i biblioteket.",
    createdAt: isoOffsetDays(1, 17),
  },
];
