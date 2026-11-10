const BUNDLE = /assets\/index-[\w-]+\.js/;
const RELOAD_KEY = 'kratos-reloaded-for';

const bundleIn = (source) => source?.match(BUNDLE)?.[0] ?? null;

async function fetchLatestBundle() {
  const response = await fetch(`${location.pathname}?v=${Date.now()}`, { cache: 'no-store' });
  return response.ok ? bundleIn(await response.text()) : null;
}

function claimReload(bundle) {
  try {
    if (sessionStorage.getItem(RELOAD_KEY) === bundle) return false;
    sessionStorage.setItem(RELOAD_KEY, bundle);
    return true;
  } catch {
    return false;
  }
}

export async function reloadIfStale() {
  const current = bundleIn(document.querySelector('script[type="module"][src*="/assets/index-"]')?.getAttribute('src'));
  if (!current) return;

  const latest = await fetchLatestBundle().catch(() => null);
  if (latest && latest !== current && claimReload(latest)) location.reload();
}
