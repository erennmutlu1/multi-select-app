import React, { useState, useEffect } from 'react';
import { IoSearchOutline } from 'react-icons/io5';
import jsonData from '../assets/items.json';
import './MultiSelect.css';

interface OptionType {
  value: string;
  label: string;
}

const MultiSelect: React.FC = () => {
  const [categories, setCategories] = useState<OptionType[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [searchCategory, setSearchCategory] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const uniqueCategories: OptionType[] = jsonData.data
      .filter((value, index, self) => self.indexOf(value) === index)
      .map((category: string) => ({
        value: category,
        label: category,
      }));

    setCategories(uniqueCategories);

    const storedCategories = localStorage.getItem('selectedCategories');
    if (storedCategories) {
      const parsedCategories = JSON.parse(storedCategories) as string[];
      setSelectedCategories((prevSelected) => {
        // Merge selected categories with the ones from local storage
        const mergedCategories = [...parsedCategories, ...prevSelected];
        // Remove duplicates
        return Array.from(new Set(mergedCategories));
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('selectedCategories', JSON.stringify(selectedCategories));
  }, [selectedCategories]);

  const handleCheckboxChange = (category: string) => {
    setSelectedCategories((prevSelected) => {
      if (prevSelected.includes(category)) {
        return prevSelected.filter((c) => c !== category);
      } else {
        return [category, ...prevSelected];
      }
    });
  };

  const filteredCategories = categories.filter(category =>
    category.label.toLowerCase().includes(searchCategory.toLowerCase())
  );

  const selectedCategoriesFirst = [
    ...selectedCategories
      .slice()
      .reverse()    
      .map((selected) => categories.find((c) => c.value === selected) as OptionType),
    ...filteredCategories.filter((category) => !selectedCategories.includes(category.value)),
  ];

  const handleSearch = () => {
    // Exception Handling  
    try {
      console.log('Selected Categories:', selectedCategories);
      console.log('Search Category:', searchCategory);
    } catch (error) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
      console.error("There is an error occured:", error);
    }
  };

  return (
    <div className="multiselect-global-container">
      <div className="multiselect-container">
        <label className="categoryLabel" htmlFor="searchCategory">
          Kategoriler
        </label>
        <div className="search-container">
          <input
            type="text"
            id="searchCategory"
            placeholder=" kategori ara...."
            value={searchCategory}
            onChange={(e) => setSearchCategory(e.target.value)}
          />
          <span className="search-icon"><IoSearchOutline /></span>
        </div>
        <div className="category-container">
          {selectedCategoriesFirst.map((category) => (
            <div key={category.value} className="category-item">
              <input
                type="checkbox"
                id={category.value}
                checked={selectedCategories.includes(category.value)}
                onChange={() => handleCheckboxChange(category.value)}
              />
              <label htmlFor={category.value} dangerouslySetInnerHTML={{ __html: category.label }} />
            </div>
          ))}
        </div>
        {error && <div className="error-message">{error}</div>}
        <button className="search-button" onClick={handleSearch}>
          Ara
        </button>
      </div>
    </div>
  );
};

export default MultiSelect;