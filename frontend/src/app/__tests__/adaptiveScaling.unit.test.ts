import { adaptiveScaling } from "@/app/utils/adaptiveScaling";

describe("adaptiveScaling function", () => {
    it("should correctly scale numerical values", async () => {
      const csvData = `id,value\n1,100\n2,200\n3,300`;
      const result = await adaptiveScaling(csvData);
  
      expect(result).toContain("id,value\n1,0\n2,0.5\n3,1"); // MinMax scaled
    });
