import re

with open("frontend/src/pages/ComparePage.tsx", "r") as f:
    content = f.read()

# 1. Insert dynamicBanks state and polling useEffect
useEffect_code = """
  const [dynamicBanks, setDynamicBanks] = useState<BankData[]>(BANKS);

  useEffect(() => {
    const fetchRates = () => {
      fetch('http://localhost:5001/api/dataset/interest-rates')
        .then(res => res.json())
        .then(data => {
          if (data?.data) {
            setDynamicBanks(prev => {
              let changed = false;
              const next = prev.map(bank => {
                const rateData = data.data.find((r: any) => r.loan_product_id && r.loan_product_id.startsWith(bank.id.toUpperCase() + '_EDU'));
                if (rateData) {
                  const newMin = parseFloat(rateData.interest_rate_min);
                  const newMax = parseFloat(rateData.interest_rate_max);
                  if (bank.minRate !== newMin || bank.maxRate !== newMax) {
                    changed = true;
                    return { ...bank, minRate: newMin, maxRate: newMax };
                  }
                }
                return bank;
              });
              return changed ? next : prev;
            });
          }
        })
        .catch(err => console.error("Error polling rates:", err));
    };

    fetchRates();
    const interval = setInterval(fetchRates, 3000);
    return () => clearInterval(interval);
  }, []);
"""

content = content.replace(
    "export const ComparePage: React.FC = () => {",
    "export const ComparePage: React.FC = () => {\n" + useEffect_code
)

# 2. Update activeBanks
content = content.replace(
    "const activeBanks = useMemo(() => BANKS.filter((b) => selected.has(b.id)), [selected]);",
    "const activeBanks = useMemo(() => dynamicBanks.filter((b) => selected.has(b.id)), [selected, dynamicBanks]);"
)

# 3. Update globalRateChartData
# We want to replace [...BANKS] with [...dynamicBanks] in globalRateChartData
content = re.sub(
    r"(const globalRateChartData = useMemo\(\(\) => \{\s*return )\[\.\.\.BANKS\]",
    r"\1[...dynamicBanks]",
    content
)

# Also update its dependency array at the end of its useMemo block
# Let's find globalRateChartData block
match = re.search(r"const globalRateChartData = useMemo\(\(\) => \{.*?\}\);", content, re.DOTALL)
if match:
    old_block = match.group(0)
    new_block = old_block.replace("}, []);", "}, [dynamicBanks]);")
    content = content.replace(old_block, new_block)


with open("frontend/src/pages/ComparePage.tsx", "w") as f:
    f.write(content)

