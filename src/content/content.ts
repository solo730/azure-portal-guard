// ─── URLs ────────────────────────────────────────────────────────────────────

const WORKER_URL    = "https://lemonsqueezy-license-worker.cloudleakguard.workers.dev";
const MONTHLY_URL   = "https://solo730.lemonsqueezy.com/checkout/buy/7ce0691f-7d4b-4eb3-ae0b-74f4281582e1";
const LIFETIME_URL  = "https://solo730.lemonsqueezy.com/checkout/buy/cac31da6-94e1-4661-b998-548341c0cd32";
const FEEDBACK_URL  = "https://www.solo730.com";

// ─── Constants ───────────────────────────────────────────────────────────────

const PANEL_ID   = "azure-portal-guard-panel";
const KEY_PRO      = "apg_pro";
const KEY_LICENSE  = "apg_license";
const KEY_INSTANCE = "apg_instance";
const KEY_VARIANT  = "apg_variant";

// ─── Types ───────────────────────────────────────────────────────────────────

type ViewMode = "navigate" | "upgrade";
type ValidateResult = "valid" | "invalid" | "unreachable";

type ProState = {
  isPro:      boolean;
  licenseKey: string | null;
  instanceId: string | null;
  variant:    "monthly" | "lifetime" | null;
};

// ─── Module state ────────────────────────────────────────────────────────────

let viewMode: ViewMode = "navigate";
let proState: ProState = { isPro: false, licenseKey: null, instanceId: null, variant: null };

// ─── Utilities ───────────────────────────────────────────────────────────────

function escapeHtml(s: string): string {
  return (s || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

// ─── Azure DOM readers (read-only) ───────────────────────────────────────────

function readAzureSubscriptionId(): string {
  // Try URL — Azure often puts subscription in the hash
  const urlMatch = window.location.href.match(/subscriptions\/([a-f0-9-]{36})/i);
  if (urlMatch) return urlMatch[1];

  // Try DOM — Azure renders subscription info in breadcrumbs and resource blades
  const selectors = [
    "[data-testid='subscription-id']",
    ".fxs-blade-content .azc-text-overflow",
    "[aria-label*='Subscription']",
  ];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    const text = el?.textContent || "";
    const m = text.match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i);
    if (m) return m[0];
  }

  // Scan page for UUID pattern (subscription IDs are UUIDs)
  const allEls = document.querySelectorAll("span, div, li");
  for (const el of Array.from(allEls)) {
    const text = el.children.length === 0 ? el.textContent || "" : "";
    const m = text.trim().match(/^([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i);
    if (m) return m[1];
  }
  return "Unknown";
}

function readAzureDirectory(): string {
  // Azure shows directory name in top nav
  const selectors = [
    "[data-testid='directory-name']",
    ".fxs-topbar-item .fxs-topbar-content",
  ];
  for (const sel of selectors) {
    const el = document.querySelector(sel);
    if (el?.textContent?.trim()) return el.textContent.trim();
  }
  // Try the page title area
  const titleEl = document.querySelector(".fxs-portal-header .fxs-topbar-item");
  if (titleEl?.textContent?.trim()) return titleEl.textContent.trim();
  return "Default Directory";
}

// ─── Azure AZ-900 aligned service data ───────────────────────────────────────

const NAV_SERVICES = [
  {
    domain: "💻 Compute",
    services: [
      { label: "Virtual Machines",  emoji: "🖥️", url: "https://portal.azure.com/#view/Microsoft_Azure_ComputeHub/ComputeHubMenuBlade/~/virtualMachinesBrowse" },
      { label: "VM Scale Sets",     emoji: "📈", url: "https://portal.azure.com/#view/Microsoft_Azure_ComputeHub/ComputeHubMenuBlade/~/virtualMachineScaleSetsBrowse" },
      { label: "App Services",      emoji: "🌐", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Web%2Fsites" },
      { label: "Functions",         emoji: "⚡", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Web%2Fsites/kind/functionapp" },
      { label: "Container Apps",    emoji: "📦", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.App%2FcontainerApps" },
      { label: "AKS",               emoji: "⎈",  url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.ContainerService%2FmanagedClusters" },
    ],
  },
  {
    domain: "🗄️ Storage",
    services: [
      { label: "Storage Accounts", emoji: "🪣", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Storage%2FStorageAccounts" },
      { label: "Blob Containers",  emoji: "📁", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Storage%2FStorageAccounts" },
      { label: "Disk Storage",     emoji: "💾", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Compute%2Fdisks" },
      { label: "Azure Files",      emoji: "📂", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Storage%2FStorageAccounts" },
    ],
  },
  {
    domain: "🗃️ Database",
    services: [
      { label: "Azure SQL",        emoji: "🐘", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Sql%2Fservers%2Fdatabases" },
      { label: "Cosmos DB",        emoji: "🌍", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.DocumentDb%2FdatabaseAccounts" },
      { label: "Azure MySQL",      emoji: "🐬", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.DBforMySQL%2Fservers" },
      { label: "Azure PostgreSQL", emoji: "🐘", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.DBforPostgreSQL%2Fservers" },
      { label: "Azure Cache",      emoji: "⚡", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Cache%2FRedis" },
    ],
  },
  {
    domain: "🌐 Networking",
    services: [
      { label: "Virtual Networks", emoji: "🔗", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Network%2FvirtualNetworks" },
      { label: "Load Balancers",   emoji: "⚖️", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Network%2FloadBalancers" },
      { label: "DNS Zones",        emoji: "🌍", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Network%2FdnsZones" },
      { label: "CDN Profiles",     emoji: "🚀", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Cdn%2Fprofiles" },
      { label: "API Management",   emoji: "🔌", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.ApiManagement%2Fservice" },
      { label: "NSG",              emoji: "🛡️", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Network%2FnetworkSecurityGroups" },
    ],
  },
  {
    domain: "🔒 Security & Identity",
    services: [
      { label: "Entra ID",          emoji: "👤", url: "https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview" },
      { label: "Users",             emoji: "👥", url: "https://portal.azure.com/#view/Microsoft_AAD_UsersAndTenants/UserManagementMenuBlade/~/AllUsers" },
      { label: "Groups",            emoji: "🫂", url: "https://portal.azure.com/#view/Microsoft_AAD_IAM/GroupsManagementMenuBlade/~/AllGroups" },
      { label: "App Registrations", emoji: "📋", url: "https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade" },
      { label: "Key Vault",         emoji: "🔑", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.KeyVault%2Fvaults" },
      { label: "Defender",          emoji: "🛡️", url: "https://portal.azure.com/#view/Microsoft_Azure_Security/SecurityMenuBlade/~/0" },
      { label: "Sentinel",          emoji: "🕵️", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/microsoft.securityinsights%2Fworkspaces" },
      { label: "Policy",            emoji: "📜", url: "https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyMenuBlade/~/Overview" },
      { label: "RBAC",              emoji: "🎭", url: "https://portal.azure.com/#view/Microsoft_Azure_AD/AccessControlMenuBlade/~/RoleAssignments" },
    ],
  },
  {
    domain: "📊 Monitoring & Management",
    services: [
      { label: "Monitor",           emoji: "📡", url: "https://portal.azure.com/#view/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/~/overview" },
      { label: "Log Analytics",     emoji: "📋", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.OperationalInsights%2Fworkspaces" },
      { label: "App Insights",      emoji: "🔍", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/microsoft.insights%2Fcomponents" },
      { label: "Alerts",            emoji: "🔔", url: "https://portal.azure.com/#view/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/~/alertsV2" },
      { label: "Automation",        emoji: "🤖", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Automation%2FAutomationAccounts" },
      { label: "Resource Groups",   emoji: "📦", url: "https://portal.azure.com/#view/HubsExtension/BrowseResourceGroups.ReactView" },
    ],
  },
  {
    domain: "💰 Cost & Billing",
    services: [
      { label: "Cost Analysis",     emoji: "📉", url: "https://portal.azure.com/#view/Microsoft_Azure_CostManagement/Menu/~/costanalysis" },
      { label: "Budgets",           emoji: "🎯", url: "https://portal.azure.com/#view/Microsoft_Azure_CostManagement/Menu/~/budgets" },
      { label: "Subscriptions",     emoji: "🧾", url: "https://portal.azure.com/#view/Microsoft_Azure_Billing/SubscriptionsBlade" },
      { label: "Advisor",           emoji: "💡", url: "https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/~/overview" },
      { label: "Reservations",      emoji: "💳", url: "https://portal.azure.com/#view/Microsoft_Azure_Reservations/ReservationsBrowseBlade" },
    ],
  },
  {
    domain: "🤖 AI & ML",
    services: [
      { label: "Azure OpenAI",      emoji: "🧠", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.CognitiveServices%2Faccounts" },
      { label: "AI Foundry",        emoji: "🏭", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.MachineLearningServices%2Fworkspaces" },
      { label: "Cognitive Services",emoji: "👁️", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.CognitiveServices%2Faccounts" },
      { label: "Bot Services",      emoji: "💬", url: "https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.BotService%2FbotServices" },
    ],
  },
];

// ─── Theme ───────────────────────────────────────────────────────────────────

function resolveTheme(): "dark" | "light" {
  return window.matchMedia?.("(prefers-color-scheme: dark)")?.matches ? "dark" : "light";
}

function applyTheme(panel: HTMLElement): void {
  const isDark = resolveTheme() === "dark";
  const bg     = isDark ? "#0b1220" : "#ffffff";
  const fg     = isDark ? "#f1f5f9" : "#111111";
  const border = isDark ? "rgba(255,255,255,0.14)" : "rgba(0,0,0,0.15)";
  const shadow = isDark ? "0 10px 28px rgba(0,0,0,0.45)" : "0 8px 24px rgba(0,0,0,0.18)";

  panel.style.background = bg;
  panel.style.color      = fg;
  panel.style.border     = `1px solid ${border}`;
  panel.style.boxShadow  = shadow;

  for (const b of Array.from(panel.querySelectorAll("button")) as HTMLButtonElement[]) {
    const variant = b.getAttribute("data-variant") || "secondary";
    if (variant === "primary") {
      b.style.background = isDark ? "#e2e8f0" : "#111";
      b.style.color      = isDark ? "#0b1220"  : "#fff";
      b.style.border     = `1px solid ${isDark ? "rgba(255,255,255,0.18)" : "rgba(0,0,0,0.15)"}`;
    } else if (variant === "ghost") {
      b.style.background = "transparent";
      b.style.color      = fg;
      b.style.border     = "none";
      b.style.opacity    = "0.7";
    } else if (variant === "accent") {
      b.style.background = isDark ? "rgba(0,120,212,0.15)" : "rgba(0,120,212,0.08)";
      b.style.color      = isDark ? "#60a5fa" : "#0078d4";
      b.style.border     = `1px solid ${isDark ? "rgba(0,120,212,0.4)" : "rgba(0,120,212,0.3)"}`;
    } else {
      b.style.background = isDark ? "rgba(255,255,255,0.06)" : "#fff";
      b.style.color      = fg;
      b.style.border     = `1px solid ${border}`;
    }
  }

  for (const c of Array.from(panel.querySelectorAll("[data-card='1']")) as HTMLElement[]) {
    c.style.background = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.02)";
    c.style.border     = `1px solid ${border}`;
  }
}

// ─── Pro state (storage) ─────────────────────────────────────────────────────

async function loadProState(): Promise<ProState> {
  try {
    const stored = await chrome.storage.local.get([KEY_PRO, KEY_LICENSE, KEY_INSTANCE, KEY_VARIANT]);
    const v = stored[KEY_VARIANT];
    return {
      isPro:      stored[KEY_PRO] === true,
      licenseKey: typeof stored[KEY_LICENSE]  === "string" && stored[KEY_LICENSE]  ? stored[KEY_LICENSE]  : null,
      instanceId: typeof stored[KEY_INSTANCE] === "string" && stored[KEY_INSTANCE] ? stored[KEY_INSTANCE] : null,
      variant:    v === "lifetime" ? "lifetime" : v === "monthly" ? "monthly" : null,
    };
  } catch {
    return { isPro: false, licenseKey: null, instanceId: null, variant: null };
  }
}

async function saveProState(state: ProState): Promise<void> {
  await chrome.storage.local.set({
    [KEY_PRO]:      state.isPro,
    [KEY_LICENSE]:  state.licenseKey ?? "",
    [KEY_INSTANCE]: state.instanceId ?? "",
    [KEY_VARIANT]:  state.variant    ?? "",
  });
  proState = state;
}

async function clearProState(): Promise<void> {
  await chrome.storage.local.remove([KEY_PRO, KEY_LICENSE, KEY_INSTANCE, KEY_VARIANT]);
  proState = { isPro: false, licenseKey: null, instanceId: null, variant: null };
}

// ─── LemonSqueezy / Cloudflare Worker ────────────────────────────────────────

async function activateLicense(licenseKey: string): Promise<{
  success:    boolean;
  instanceId: string | null;
  error:      string | null;
}> {
  try {
    const res = await fetch(`${WORKER_URL}/activate`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        license_key:   licenseKey,
        instance_name: `Azure Portal Guard - ${navigator.userAgent.slice(0, 60)}`,
      }),
    });
    if (!res.ok) return { success: false, instanceId: null, error: `Server error: ${res.status}` };
    const data = await res.json() as { activated?: boolean; instance_id?: string; error?: string };
    if (data.activated && data.instance_id) {
      return { success: true, instanceId: data.instance_id, error: null };
    }
    return { success: false, instanceId: null, error: data.error ?? "Activation failed. Please check your license key." };
  } catch (err) {
    return { success: false, instanceId: null, error: `Could not reach activation server. (${err instanceof Error ? err.message : String(err)})` };
  }
}

async function validateLicense(licenseKey: string, instanceId: string): Promise<{ result: ValidateResult; variant: "monthly" | "lifetime" | null }> {
  try {
    const res = await fetch(`${WORKER_URL}/validate`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ license_key: licenseKey, instance_id: instanceId }),
    });
    if (!res.ok) return { result: "unreachable", variant: null };
    const data    = await res.json() as { valid?: boolean; product_name?: string; variant_name?: string };
    const nameStr = ((data.product_name || "") + " " + (data.variant_name || "")).toLowerCase();
    const variant = nameStr.includes("lifetime") ? "lifetime" : "monthly";
    return { result: data.valid === true ? "valid" : "invalid", variant };
  } catch {
    return { result: "unreachable", variant: null };
  }
}

// ─── Navigate view ───────────────────────────────────────────────────────────

function renderNavigateView(panel: HTMLElement): void {
  const container = panel.querySelector<HTMLElement>("#apg-navigate-content");
  if (!container) return;

  const subscriptionId = readAzureSubscriptionId();
  const isDark  = resolveTheme() === "dark";
  const pillBg  = isDark ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.05)";
  const pillFg  = isDark ? "#60a5fa" : "#0078d4";

  const infoBar = `
    <div style="display:flex; gap:8px; margin-bottom:14px; flex-wrap:wrap;">
      <div style="font-size:13px; padding:6px 12px; border-radius:20px;
                  background:${pillBg}; opacity:.9; display:flex; align-items:center; gap:5px;">
        ☁️ <span style="font-weight:700; color:${pillFg};">Azure Portal</span>
      </div>
      <div style="font-size:13px; padding:6px 12px; border-radius:20px;
                  background:${pillBg}; opacity:.9; display:flex; align-items:center; gap:5px;">
        🔑 <span style="font-weight:700; font-family:monospace; font-size:11px;">${escapeHtml(subscriptionId)}</span>
      </div>
    </div>
    <div style="font-size:10px; opacity:.4; margin-bottom:14px; line-height:1.4;">
      Read-only • Values detected from Azure Portal DOM
    </div>`;

  const groups = NAV_SERVICES.map((group) => {
    const buttons = group.services.map((svc) => {
      const id = `apg-nav-${svc.label.replace(/\s+/g, "-").toLowerCase()}`;
      return `<button id="${id}" data-variant="secondary"
        style="padding:8px 6px; border-radius:10px; cursor:pointer; font-size:11px;
               text-align:center; line-height:1.3; display:flex; flex-direction:column;
               align-items:center; gap:3px; width:100%;">
        <span style="font-size:16px;">${svc.emoji}</span>
        <span>${escapeHtml(svc.label)}</span>
      </button>`;
    }).join("");
    return `
      <div style="margin-bottom:14px;">
        <div style="font-size:11px; font-weight:800; opacity:.55; text-transform:uppercase;
                    letter-spacing:.5px; margin-bottom:8px;">${group.domain}</div>
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:5px;">
          ${buttons}
        </div>
      </div>`;
  }).join("");

  container.innerHTML = infoBar + groups;

  NAV_SERVICES.forEach((group) => {
    group.services.forEach((svc) => {
      const id  = `apg-nav-${svc.label.replace(/\s+/g, "-").toLowerCase()}`;
      const btn = panel.querySelector<HTMLButtonElement>(`#${id}`);
      if (!btn) return;
      btn.onclick = () => { window.location.href = svc.url; };
    });
  });

  applyTheme(panel);
}

// ─── Upgrade view ─────────────────────────────────────────────────────────────

function renderUpgradeView(panel: HTMLElement): void {
  const container = panel.querySelector<HTMLElement>("#apg-upgrade-content");
  if (!container) return;

  if (proState.isPro) {
    const isLifetime = proState.variant === "lifetime";
    const badgeLabel = isLifetime ? "Pro • Lifetime" : "Pro • Monthly";

    container.innerHTML = `
      <div>
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
          <div style="font-weight:900; font-size:15px;">Azure Portal Guard</div>
          <div style="font-size:11px; padding:3px 10px; border-radius:20px;
                      background:linear-gradient(135deg,#0078d4,#004578); color:#fff; font-weight:800;">
            ${escapeHtml(badgeLabel)}
          </div>
        </div>
        <div style="opacity:.8; font-size:12px; margin-bottom:14px; line-height:1.5;">
          Your license is active. Thank you for supporting CloudGuard!
        </div>
        <div style="font-size:12px; opacity:.7; margin-bottom:14px; line-height:1.5;">
          💡 This is the same license key that works in CloudLeak Guard (AWS) and the upcoming GCP extension.
        </div>
        <button id="apg-manage-btn" data-variant="secondary"
          style="width:100%; padding:10px; border-radius:10px; cursor:pointer; font-size:12px; margin-bottom:8px;">
          Remove license
        </button>
        <div id="apg-manage-confirm" style="display:none; margin-bottom:8px;">
          <div data-card="1" style="padding:12px; border-radius:12px; font-size:12px; line-height:1.5;">
            ⚠️ This will remove your license from this device. Enter your key again anytime to reactivate.
            <div style="display:flex; gap:8px; margin-top:10px;">
              <button id="apg-confirm-deactivate" data-variant="secondary"
                style="flex:1; padding:8px; border-radius:10px; cursor:pointer; font-size:12px;">
                Yes, remove
              </button>
              <button id="apg-cancel-deactivate" data-variant="primary"
                style="flex:1; padding:8px; border-radius:10px; cursor:pointer; font-size:12px;">
                Cancel
              </button>
            </div>
          </div>
        </div>
        <div style="opacity:.5; font-size:11px; line-height:1.4; margin-top:4px;">
          Need help? <a href="mailto:cloudleakguard@proton.me" style="color:inherit;">cloudleakguard@proton.me</a>
        </div>
      </div>`;

    const manageBtn  = panel.querySelector<HTMLButtonElement>("#apg-manage-btn")!;
    const confirmBox = panel.querySelector<HTMLElement>("#apg-manage-confirm")!;
    const confirmBtn = panel.querySelector<HTMLButtonElement>("#apg-confirm-deactivate")!;
    const cancelBtn  = panel.querySelector<HTMLButtonElement>("#apg-cancel-deactivate")!;

    manageBtn.onclick  = () => {
      confirmBox.style.display = confirmBox.style.display === "none" ? "block" : "none";
      applyTheme(panel);
    };
    cancelBtn.onclick  = () => { confirmBox.style.display = "none"; };
    confirmBtn.onclick = async () => {
      await clearProState();
      renderUpgradeView(panel);
      applyTheme(panel);
    };

  } else {
    container.innerHTML = `
      <div>
        <div style="font-weight:900; font-size:15px; margin-bottom:4px;">Azure Portal Guard Pro</div>
        <div style="opacity:.75; font-size:12px; margin-bottom:16px; line-height:1.5;">
          One license covers AWS, Azure, and GCP. Buy once, use everywhere.
        </div>

        <div style="display:flex; gap:8px; margin-bottom:14px;">
          <div data-card="1" style="flex:1; padding:12px; border-radius:12px; text-align:center;">
            <div style="font-size:10px; font-weight:800; opacity:.6; text-transform:uppercase; letter-spacing:.5px; margin-bottom:6px;">Monthly</div>
            <div style="font-size:24px; font-weight:900; margin-bottom:2px;">$19.99</div>
            <div style="font-size:10px; opacity:.55; margin-bottom:10px;">per month</div>
            <button id="apg-monthly-btn" data-variant="primary"
              style="width:100%; padding:8px; border-radius:8px; cursor:pointer; font-size:12px; font-weight:700;">
              Get Pro
            </button>
          </div>
          <div data-card="1" style="flex:1; padding:12px; border-radius:12px; text-align:center; position:relative;
                                     border:1px solid rgba(0,120,212,0.5) !important;">
            <div style="position:absolute; top:-9px; left:50%; transform:translateX(-50%);
                        background:linear-gradient(135deg,#0078d4,#004578); color:#fff;
                        font-size:9px; font-weight:800; padding:2px 10px; border-radius:20px; white-space:nowrap;">
              BEST VALUE
            </div>
            <div style="font-size:10px; font-weight:800; opacity:.6; text-transform:uppercase; letter-spacing:.5px; margin-bottom:6px;">Lifetime</div>
            <div style="font-size:24px; font-weight:900; margin-bottom:2px;">$149</div>
            <div style="font-size:10px; opacity:.55; margin-bottom:10px;">one-time</div>
            <button id="apg-lifetime-btn" data-variant="primary"
              style="width:100%; padding:8px; border-radius:8px; cursor:pointer; font-size:12px; font-weight:700;
                     background:linear-gradient(135deg,#0078d4,#004578) !important; border:none !important;">
              Get Lifetime
            </button>
          </div>
        </div>

        <div style="display:flex; gap:6px; margin-bottom:14px; flex-wrap:wrap;">
          <div style="font-size:11px; opacity:.65; padding:4px 8px; border-radius:20px; border:1px solid rgba(128,128,128,0.25);">🔐 No Azure credentials</div>
          <div style="font-size:11px; opacity:.65; padding:4px 8px; border-radius:20px; border:1px solid rgba(128,128,128,0.25);">🖥️ Runs locally</div>
          <div style="font-size:11px; opacity:.65; padding:4px 8px; border-radius:20px; border:1px solid rgba(128,128,128,0.25);">☁️ AWS + Azure + GCP</div>
        </div>

        <div data-card="1" style="padding:12px; border-radius:12px; margin-bottom:12px;">
          <div style="font-weight:800; font-size:12px; margin-bottom:4px;">Already have a license key?</div>
          <div style="font-size:11px; opacity:.65; margin-bottom:8px;">Same key works in CloudLeak Guard (AWS) and this extension.</div>
          <input
            id="apg-license-input"
            type="text"
            placeholder="XXXX-XXXX-XXXX-XXXX"
            style="width:100%; box-sizing:border-box; padding:9px 10px; border-radius:10px;
                   border:1px solid rgba(128,128,128,0.3); font-size:13px; font-family:monospace;
                   outline:none; background:transparent;"
          />
          <button id="apg-activate-btn" data-variant="primary"
            style="width:100%; margin-top:8px; padding:10px; border-radius:10px; cursor:pointer; font-weight:700;">
            Activate Pro
          </button>
          <div id="apg-activate-status" style="margin-top:6px; font-size:12px; min-height:16px;"></div>
        </div>

        <div style="margin-top:4px; opacity:.5; font-size:11px; line-height:1.4;">
          Azure Portal Guard provides informational navigation only. Not affiliated with Microsoft Azure.
        </div>
      </div>`;

    panel.querySelector<HTMLButtonElement>("#apg-monthly-btn")!.onclick  = () => {};
    panel.querySelector<HTMLButtonElement>("#apg-lifetime-btn")!.onclick = () => {};

    const activateBtn    = panel.querySelector<HTMLButtonElement>("#apg-activate-btn")!;
    const keyInput       = panel.querySelector<HTMLInputElement>("#apg-license-input")!;
    const activateStatus = panel.querySelector<HTMLElement>("#apg-activate-status")!;

    activateBtn.onclick = async () => {
      const key = keyInput.value.trim();
      if (!key) {
        activateStatus.textContent = "Please enter your license key.";
        activateStatus.style.color = "#fc8181";
        return;
      }
      activateBtn.disabled    = true;
      activateBtn.textContent = "Activating...";
      activateStatus.textContent = "";

      const result = await activateLicense(key);
      if (result.success && result.instanceId) {
        const { result: vResult, variant } = await validateLicense(key, result.instanceId);
        const resolvedVariant = vResult === "valid" ? (variant ?? "monthly") : "monthly";
        await saveProState({ isPro: true, licenseKey: key, instanceId: result.instanceId, variant: resolvedVariant });
        renderUpgradeView(panel);
        applyTheme(panel);
      } else {
        activateStatus.textContent = result.error ?? "Activation failed.";
        activateStatus.style.color = "#fc8181";
        activateBtn.disabled    = false;
        activateBtn.textContent = "Activate Pro";
      }
    };
  }

  applyTheme(panel);
}

// ─── Panel ───────────────────────────────────────────────────────────────────

function ensurePanel(): void {
  if (document.getElementById(PANEL_ID)) return;

  const panel = document.createElement("div");
  panel.id = PANEL_ID;
  panel.style.position     = "fixed";
  panel.style.top          = "60px";
  panel.style.right        = "16px";
  panel.style.width        = "360px";
  panel.style.maxHeight    = "75vh";
  panel.style.overflow     = "auto";
  panel.style.zIndex       = "2147483647";
  panel.style.borderRadius = "16px";
  panel.style.fontFamily   = "system-ui, -apple-system, Segoe UI, Roboto, Arial";
  panel.style.fontSize     = "13px";

  panel.innerHTML = `
    <div style="padding:12px 14px; border-bottom:1px solid rgba(128,128,128,0.15);
                display:flex; justify-content:space-between; align-items:center;">
      <div>
        <div style="font-weight:900; font-size:14px; letter-spacing:-.2px;">Azure Portal Guard</div>
        <div style="opacity:.55; font-size:11px; margin-top:1px;">Read-only • Not affiliated with Microsoft</div>
      </div>
      <button id="apg-close" data-variant="ghost" style="font-size:20px; cursor:pointer; line-height:1; padding:4px;">×</button>
    </div>

    <div style="padding:12px 14px;">

      <div style="display:flex; gap:4px; margin-bottom:12px; background:rgba(128,128,128,0.1); padding:3px; border-radius:12px;">
        <button id="apg-tab-navigate" data-variant="primary"
          style="flex:1; padding:8px 4px; border-radius:10px; cursor:pointer; font-size:12px; font-weight:700;">Navigate</button>
        <button id="apg-tab-upgrade" data-variant="ghost"
          style="flex:1; padding:8px 4px; border-radius:10px; cursor:pointer; font-size:12px; font-weight:700;">Pro</button>
      </div>

      <div id="apg-view-navigate">
        <div id="apg-navigate-content">Loading...</div>
      </div>

      <div id="apg-view-upgrade" style="display:none;">
        <div id="apg-upgrade-content">Loading...</div>
      </div>

    </div>
  `;

  document.documentElement.appendChild(panel);
  applyTheme(panel);

  window.matchMedia?.("(prefers-color-scheme: dark)")
    ?.addEventListener?.("change", () => applyTheme(panel));

  const tabNavigate = panel.querySelector<HTMLButtonElement>("#apg-tab-navigate")!;
  const tabUpgrade  = panel.querySelector<HTMLButtonElement>("#apg-tab-upgrade")!;
  const viewNavigate= panel.querySelector<HTMLElement>("#apg-view-navigate")!;
  const viewUpgrade = panel.querySelector<HTMLElement>("#apg-view-upgrade")!;

  const setView = (mode: ViewMode) => {
    viewMode = mode;
    viewNavigate.style.display = "none";
    viewUpgrade.style.display  = "none";
    tabNavigate.setAttribute("data-variant", "ghost");
    tabUpgrade.setAttribute("data-variant",  "ghost");

    if (mode === "navigate") {
      viewNavigate.style.display = "block";
      tabNavigate.setAttribute("data-variant", "primary");
      renderNavigateView(panel);
    } else {
      viewUpgrade.style.display = "block";
      tabUpgrade.setAttribute("data-variant", "primary");
      renderUpgradeView(panel);
    }
    applyTheme(panel);
  };

  tabNavigate.onclick = () => setView("navigate");
  tabUpgrade.onclick  = () => setView("upgrade");

  panel.querySelector<HTMLButtonElement>("#apg-close")!.onclick = () => panel.remove();

  // ── Init ──
  (async () => {
    try {
      proState = await loadProState();

      if (proState.isPro && proState.licenseKey && proState.instanceId) {
        validateLicense(proState.licenseKey, proState.instanceId).then(async ({ result, variant }) => {
          if (result === "invalid") {
            await clearProState();
            renderUpgradeView(panel);
            applyTheme(panel);
          } else if (result === "valid" && variant && proState.variant !== variant) {
            await saveProState({ ...proState, variant });
          }
        });
      }

      renderNavigateView(panel);
      applyTheme(panel);
    } catch {
      // ignore init errors
    }
  })();
}

// ─── Init ────────────────────────────────────────────────────────────────────

console.log("Azure Portal Guard loaded (read-only)");
ensurePanel();