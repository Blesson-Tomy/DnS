# Smart India Hackathon 2024 (Prelims): Data download Duplication Alert System (DDAS)

The Smart India Hackathon is conducted by the Government of India as part of a large scale invitation to solve the various problems faced by companies and government institutions across the country. It is an annual event with a prelims round conducted by local institutes and then a national round for those who qualify for the prelims round.

# PROBLEM STATEMENT:

In an institute environment, multiple users often require access to the same datasets for various purposes. However, due to lack of communication or visibility, these users may unknowingly download duplicate copies of the same data. This leads to unnecessary consumption of resources, including bandwidth and storage, and complicates data management. The DDAS (Data download Duplication Alert System) addresses this issue by notifying users with an alert if a potential duplicate download is identified. This system helps optimize resource usage, save time, and streamline data management processes. Description: Managing data downloads efficiently is crucial for optimizing resources and maintaining order in any organization. A DDAS addresses the issue of multiple users inadvertently downloading duplicate copies of the same datasets across various fields. The DDAS operates by maintaining a repository or database that records metadata of all downloaded datasets. This metadata includes details such as file names, sizes, timestamps, and download locations. When a user initiates a download request, the system checks the database to determine if the dataset has already been downloaded by any user. To identify duplicates accurately, the system uses file history or unique identifiers, ensuring duplicates are detected even if file names differ. If a potential duplicate is detected, the system prompts the user with an alert. This alert provides comprehensive information about the existing dataset, including its location and the timestamp of the original download. By doing so, the DDAS helps users avoid unnecessary downloads, thereby optimizing resource usage, saving time, and streamlining data management processes. This system is designed to be flexible and applicable across various fields and industries, including academic institutions, research facilities, and any other domain where efficient data management is critical. By preventing duplicate downloads, the DDAS ensures that resources are used effectively, contributing to overall organizational efficiency. Expected Solution: To mitigate this issue, a robust solution is needed to design and develop a system that generates alerts when users attempt to download data already available within the institute's repository or any of the user accounts. The alert system should promptly notify users about the existence, properties (such as the period, spatial domain, and other relevant data attributes), and location of the required data, thereby preventing unnecessary duplication and promoting efficient resource utilization. Implementing this solution allows organizations to streamline data access processes and reduce redundancy. This system has to be applicable across various fields and industries, including academic institutions, research facilities, government agencies, and more.


# OUR SOLUTION:

Our solution is to develop an extension for the browsers. This extension will read the metadata of the downloaded files and store them using a Hashmap. The key and it's values will be checked when another download is triggered. If a duplicate exists in Hashmap, then the user will be prompted to confirm download. Else, the download is executed. There is a button feature implemented to clear the hashmap when necessary.

# Tech Stack Used
1. HTML
2. CSS
3. Javascript

## Team Members:
1. Ajay Mohan
2. [Alex George](https://github.com/Alex-George1)
3. [Anna Rose Thomas](https://github.com/anna-rose-004)
4. [Blesson Karikulammalayil Tomy](https://github.com/blesson-tomy)
3. [Milka Joseph](https://github.com/milkajoseph)
4. [Sidharth Dev Lal](https://github.com/sidharth1037)