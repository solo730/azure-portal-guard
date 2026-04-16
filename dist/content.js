var e=`https://lemonsqueezy-license-worker.cloudleakguard.workers.dev`,t=`azure-portal-guard-panel`,n=`apg_pro`,r=`apg_license`,i=`apg_instance`,a=`apg_variant`,o={isPro:!1,licenseKey:null,instanceId:null,variant:null};function s(e){return(e||``).replaceAll(`&`,`&amp;`).replaceAll(`<`,`&lt;`).replaceAll(`>`,`&gt;`).replaceAll(`"`,`&quot;`).replaceAll(`'`,`&#039;`)}function c(){let e=window.location.href.match(/subscriptions\/([a-f0-9-]{36})/i);if(e)return e[1];for(let e of[`[data-testid='subscription-id']`,`.fxs-blade-content .azc-text-overflow`,`[aria-label*='Subscription']`]){let t=(document.querySelector(e)?.textContent||``).match(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i);if(t)return t[0]}let t=document.querySelectorAll(`span, div, li`);for(let e of Array.from(t)){let t=(e.children.length===0&&e.textContent||``).trim().match(/^([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/i);if(t)return t[1]}return`Unknown`}var l=[{domain:`💻 Compute`,services:[{label:`Virtual Machines`,emoji:`🖥️`,url:`https://portal.azure.com/#view/Microsoft_Azure_ComputeHub/ComputeHubMenuBlade/~/virtualMachinesBrowse`},{label:`VM Scale Sets`,emoji:`📈`,url:`https://portal.azure.com/#view/Microsoft_Azure_ComputeHub/ComputeHubMenuBlade/~/virtualMachineScaleSetsBrowse`},{label:`App Services`,emoji:`🌐`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Web%2Fsites`},{label:`Functions`,emoji:`⚡`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Web%2Fsites/kind/functionapp`},{label:`Container Apps`,emoji:`📦`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.App%2FcontainerApps`},{label:`AKS`,emoji:`⎈`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.ContainerService%2FmanagedClusters`}]},{domain:`🗄️ Storage`,services:[{label:`Storage Accounts`,emoji:`🪣`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Storage%2FStorageAccounts`},{label:`Blob Containers`,emoji:`📁`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Storage%2FStorageAccounts`},{label:`Disk Storage`,emoji:`💾`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Compute%2Fdisks`},{label:`Azure Files`,emoji:`📂`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Storage%2FStorageAccounts`}]},{domain:`🗃️ Database`,services:[{label:`Azure SQL`,emoji:`🐘`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Sql%2Fservers%2Fdatabases`},{label:`Cosmos DB`,emoji:`🌍`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.DocumentDb%2FdatabaseAccounts`},{label:`Azure MySQL`,emoji:`🐬`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.DBforMySQL%2Fservers`},{label:`Azure PostgreSQL`,emoji:`🐘`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.DBforPostgreSQL%2Fservers`},{label:`Azure Cache`,emoji:`⚡`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Cache%2FRedis`}]},{domain:`🌐 Networking`,services:[{label:`Virtual Networks`,emoji:`🔗`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Network%2FvirtualNetworks`},{label:`Load Balancers`,emoji:`⚖️`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Network%2FloadBalancers`},{label:`DNS Zones`,emoji:`🌍`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Network%2FdnsZones`},{label:`CDN Profiles`,emoji:`🚀`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Cdn%2Fprofiles`},{label:`API Management`,emoji:`🔌`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.ApiManagement%2Fservice`},{label:`NSG`,emoji:`🛡️`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Network%2FnetworkSecurityGroups`}]},{domain:`🔒 Security & Identity`,services:[{label:`Entra ID`,emoji:`👤`,url:`https://portal.azure.com/#view/Microsoft_AAD_IAM/ActiveDirectoryMenuBlade/~/Overview`},{label:`Users`,emoji:`👥`,url:`https://portal.azure.com/#view/Microsoft_AAD_UsersAndTenants/UserManagementMenuBlade/~/AllUsers`},{label:`Groups`,emoji:`🫂`,url:`https://portal.azure.com/#view/Microsoft_AAD_IAM/GroupsManagementMenuBlade/~/AllGroups`},{label:`App Registrations`,emoji:`📋`,url:`https://portal.azure.com/#view/Microsoft_AAD_RegisteredApps/ApplicationsListBlade`},{label:`Key Vault`,emoji:`🔑`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.KeyVault%2Fvaults`},{label:`Defender`,emoji:`🛡️`,url:`https://portal.azure.com/#view/Microsoft_Azure_Security/SecurityMenuBlade/~/0`},{label:`Sentinel`,emoji:`🕵️`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/microsoft.securityinsights%2Fworkspaces`},{label:`Policy`,emoji:`📜`,url:`https://portal.azure.com/#view/Microsoft_Azure_Policy/PolicyMenuBlade/~/Overview`},{label:`RBAC`,emoji:`🎭`,url:`https://portal.azure.com/#view/Microsoft_Azure_AD/AccessControlMenuBlade/~/RoleAssignments`}]},{domain:`📊 Monitoring & Management`,services:[{label:`Monitor`,emoji:`📡`,url:`https://portal.azure.com/#view/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/~/overview`},{label:`Log Analytics`,emoji:`📋`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.OperationalInsights%2Fworkspaces`},{label:`App Insights`,emoji:`🔍`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/microsoft.insights%2Fcomponents`},{label:`Alerts`,emoji:`🔔`,url:`https://portal.azure.com/#view/Microsoft_Azure_Monitoring/AzureMonitoringBrowseBlade/~/alertsV2`},{label:`Automation`,emoji:`🤖`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.Automation%2FAutomationAccounts`},{label:`Resource Groups`,emoji:`📦`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResourceGroups.ReactView`}]},{domain:`💰 Cost & Billing`,services:[{label:`Cost Analysis`,emoji:`📉`,url:`https://portal.azure.com/#view/Microsoft_Azure_CostManagement/Menu/~/costanalysis`},{label:`Budgets`,emoji:`🎯`,url:`https://portal.azure.com/#view/Microsoft_Azure_CostManagement/Menu/~/budgets`},{label:`Subscriptions`,emoji:`🧾`,url:`https://portal.azure.com/#view/Microsoft_Azure_Billing/SubscriptionsBlade`},{label:`Advisor`,emoji:`💡`,url:`https://portal.azure.com/#view/Microsoft_Azure_Expert/AdvisorMenuBlade/~/overview`},{label:`Reservations`,emoji:`💳`,url:`https://portal.azure.com/#view/Microsoft_Azure_Reservations/ReservationsBrowseBlade`}]},{domain:`🤖 AI & ML`,services:[{label:`Azure OpenAI`,emoji:`🧠`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.CognitiveServices%2Faccounts`},{label:`AI Foundry`,emoji:`🏭`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.MachineLearningServices%2Fworkspaces`},{label:`Cognitive Services`,emoji:`👁️`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.CognitiveServices%2Faccounts`},{label:`Bot Services`,emoji:`💬`,url:`https://portal.azure.com/#view/HubsExtension/BrowseResource/resourceType/Microsoft.BotService%2FbotServices`}]}];function u(){let e=document.documentElement;if(e.classList.contains(`fxs-mode-dark`))return`dark`;if(e.classList.contains(`fxs-mode-light`))return`light`;let t=window.getComputedStyle(document.body).backgroundColor.match(/\d+/g);return t&&t.length>=3&&(parseInt(t[0])+parseInt(t[1])+parseInt(t[2]))/3<128?`dark`:`light`}function d(e){let t=u()===`dark`,n=t?`#0b1220`:`#ffffff`,r=t?`#f1f5f9`:`#111111`,i=t?`rgba(255,255,255,0.14)`:`rgba(0,0,0,0.15)`,a=t?`0 10px 28px rgba(0,0,0,0.45)`:`0 8px 24px rgba(0,0,0,0.18)`;e.style.background=n,e.style.color=r,e.style.border=`1px solid ${i}`,e.style.boxShadow=a;for(let n of Array.from(e.querySelectorAll(`button`))){let e=n.getAttribute(`data-variant`)||`secondary`;e===`primary`?(n.style.background=t?`#e2e8f0`:`#111`,n.style.color=t?`#0b1220`:`#fff`,n.style.border=`1px solid ${t?`rgba(255,255,255,0.18)`:`rgba(0,0,0,0.15)`}`):e===`ghost`?(n.style.background=`transparent`,n.style.color=r,n.style.border=`none`,n.style.opacity=`0.7`):e===`accent`?(n.style.background=t?`rgba(0,120,212,0.15)`:`rgba(0,120,212,0.08)`,n.style.color=t?`#60a5fa`:`#0078d4`,n.style.border=`1px solid ${t?`rgba(0,120,212,0.4)`:`rgba(0,120,212,0.3)`}`):(n.style.background=t?`rgba(255,255,255,0.06)`:`#fff`,n.style.color=r,n.style.border=`1px solid ${i}`)}for(let n of Array.from(e.querySelectorAll(`[data-card='1']`)))n.style.background=t?`rgba(255,255,255,0.04)`:`rgba(0,0,0,0.02)`,n.style.border=`1px solid ${i}`}async function f(){try{let e=await chrome.storage.local.get([n,r,i,a]),t=e[a];return{isPro:e[n]===!0,licenseKey:typeof e[r]==`string`&&e[r]?e[r]:null,instanceId:typeof e[i]==`string`&&e[i]?e[i]:null,variant:t===`lifetime`?`lifetime`:t===`monthly`?`monthly`:null}}catch{return{isPro:!1,licenseKey:null,instanceId:null,variant:null}}}async function p(e){await chrome.storage.local.set({[n]:e.isPro,[r]:e.licenseKey??``,[i]:e.instanceId??``,[a]:e.variant??``}),o=e}async function m(){await chrome.storage.local.remove([n,r,i,a]),o={isPro:!1,licenseKey:null,instanceId:null,variant:null}}async function h(t){try{let n=await fetch(`${e}/activate`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({license_key:t,instance_name:`Azure Portal Guard - ${navigator.userAgent.slice(0,60)}`})});if(!n.ok)return{success:!1,instanceId:null,error:`Server error: ${n.status}`};let r=await n.json();return r.activated&&r.instance_id?{success:!0,instanceId:r.instance_id,error:null}:{success:!1,instanceId:null,error:r.error??`Activation failed. Please check your license key.`}}catch(e){return{success:!1,instanceId:null,error:`Could not reach activation server. (${e instanceof Error?e.message:String(e)})`}}}async function g(t,n){try{let r=await fetch(`${e}/validate`,{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({license_key:t,instance_id:n})});if(!r.ok)return{result:`unreachable`,variant:null};let i=await r.json(),a=((i.product_name||``)+` `+(i.variant_name||``)).toLowerCase().includes(`lifetime`)?`lifetime`:`monthly`;return{result:i.valid===!0?`valid`:`invalid`,variant:a}}catch{return{result:`unreachable`,variant:null}}}function _(e){let t=e.querySelector(`#apg-navigate-content`);if(!t)return;let n=c(),r=u()===`dark`,i=r?`rgba(255,255,255,0.07)`:`rgba(0,0,0,0.05)`;t.innerHTML=`
    <div style="display:flex; gap:8px; margin-bottom:14px; flex-wrap:wrap;">
      <div style="font-size:13px; padding:6px 12px; border-radius:20px;
                  background:${i}; opacity:.9; display:flex; align-items:center; gap:5px;">
        ☁️ <span style="font-weight:700; color:${r?`#60a5fa`:`#0078d4`};">Azure Portal</span>
      </div>
      <div style="font-size:13px; padding:6px 12px; border-radius:20px;
                  background:${i}; opacity:.9; display:flex; align-items:center; gap:5px;">
        🔑 <span style="font-weight:700; font-family:monospace; font-size:11px;">${s(n)}</span>
      </div>
    </div>
    <div style="font-size:10px; opacity:.4; margin-bottom:14px; line-height:1.4;">
      Read-only • Values detected from Azure Portal DOM
    </div>`+l.map(e=>{let t=e.services.map(e=>`<button id="${`apg-nav-${e.label.replace(/\s+/g,`-`).toLowerCase()}`}" data-variant="secondary"
        style="padding:8px 6px; border-radius:10px; cursor:pointer; font-size:11px;
               text-align:center; line-height:1.3; display:flex; flex-direction:column;
               align-items:center; gap:3px; width:100%;">
        <span style="font-size:16px;">${e.emoji}</span>
        <span>${s(e.label)}</span>
      </button>`).join(``);return`
      <div style="margin-bottom:14px;">
        <div style="font-size:11px; font-weight:800; opacity:.55; text-transform:uppercase;
                    letter-spacing:.5px; margin-bottom:8px;">${e.domain}</div>
        <div style="display:grid; grid-template-columns:1fr 1fr 1fr; gap:5px;">
          ${t}
        </div>
      </div>`}).join(``),l.forEach(t=>{t.services.forEach(t=>{let n=`apg-nav-${t.label.replace(/\s+/g,`-`).toLowerCase()}`,r=e.querySelector(`#${n}`);r&&(r.onclick=()=>{window.location.href=t.url})})}),d(e)}function v(e){let t=e.querySelector(`#apg-upgrade-content`);if(t){if(o.isPro){t.innerHTML=`
      <div>
        <div style="display:flex; align-items:center; gap:8px; margin-bottom:12px;">
          <div style="font-weight:900; font-size:15px;">Azure Portal Guard</div>
          <div style="font-size:11px; padding:3px 10px; border-radius:20px;
                      background:linear-gradient(135deg,#0078d4,#004578); color:#fff; font-weight:800;">
            ${s(o.variant===`lifetime`?`Pro • Lifetime`:`Pro • Monthly`)}
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
      </div>`;let n=e.querySelector(`#apg-manage-btn`),r=e.querySelector(`#apg-manage-confirm`),i=e.querySelector(`#apg-confirm-deactivate`),a=e.querySelector(`#apg-cancel-deactivate`);n.onclick=()=>{r.style.display=r.style.display===`none`?`block`:`none`,d(e)},a.onclick=()=>{r.style.display=`none`},i.onclick=async()=>{await m(),v(e),d(e)}}else{t.innerHTML=`
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
      </div>`,e.querySelector(`#apg-monthly-btn`).onclick=()=>{},e.querySelector(`#apg-lifetime-btn`).onclick=()=>{};let n=e.querySelector(`#apg-activate-btn`),r=e.querySelector(`#apg-license-input`),i=e.querySelector(`#apg-activate-status`);n.onclick=async()=>{let t=r.value.trim();if(!t){i.textContent=`Please enter your license key.`,i.style.color=`#fc8181`;return}n.disabled=!0,n.textContent=`Activating...`,i.textContent=``;let a=await h(t);if(a.success&&a.instanceId){let{result:n,variant:r}=await g(t,a.instanceId),i=n===`valid`?r??`monthly`:`monthly`;await p({isPro:!0,licenseKey:t,instanceId:a.instanceId,variant:i}),v(e),d(e)}else i.textContent=a.error??`Activation failed.`,i.style.color=`#fc8181`,n.disabled=!1,n.textContent=`Activate Pro`}}d(e)}}function y(){if(document.getElementById(t))return;let e=document.createElement(`div`);e.id=t,e.style.position=`fixed`,e.style.top=`60px`,e.style.right=`16px`,e.style.width=`360px`,e.style.maxHeight=`75vh`,e.style.overflow=`auto`,e.style.zIndex=`2147483647`,e.style.borderRadius=`16px`,e.style.fontFamily=`system-ui, -apple-system, Segoe UI, Roboto, Arial`,e.style.fontSize=`13px`,e.innerHTML=`
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
  `,document.documentElement.appendChild(e),d(e),window.matchMedia?.(`(prefers-color-scheme: dark)`)?.addEventListener?.(`change`,()=>d(e));let n=e.querySelector(`#apg-tab-navigate`),r=e.querySelector(`#apg-tab-upgrade`),i=e.querySelector(`#apg-view-navigate`),a=e.querySelector(`#apg-view-upgrade`),s=t=>{i.style.display=`none`,a.style.display=`none`,n.setAttribute(`data-variant`,`ghost`),r.setAttribute(`data-variant`,`ghost`),t===`navigate`?(i.style.display=`block`,n.setAttribute(`data-variant`,`primary`),_(e)):(a.style.display=`block`,r.setAttribute(`data-variant`,`primary`),v(e)),d(e)};n.onclick=()=>s(`navigate`),r.onclick=()=>s(`upgrade`),e.querySelector(`#apg-close`).onclick=()=>e.remove(),(async()=>{try{o=await f(),o.isPro&&o.licenseKey&&o.instanceId&&g(o.licenseKey,o.instanceId).then(async({result:t,variant:n})=>{t===`invalid`?(await m(),v(e),d(e)):t===`valid`&&n&&o.variant!==n&&await p({...o,variant:n})}),_(e),d(e)}catch{}})()}console.log(`Azure Portal Guard loaded (read-only)`),y();